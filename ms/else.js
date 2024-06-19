/* 1.gpt交互:
首先是在页面中嵌入一个与gpt对话的模块，它是一个单独的组件，整个对话框中的一些初始状态基本上是写死的，比如说一开始机器人的说话内容展示的就是根据当前页面的公司或人员信息的简单介绍，用户可以点击一些提供的固定内容给机器人发送相应的问题，然后像服务器端发送请求，前端这边根据返回的数据，和发送中的状态，来设置对应的交互效果和展示，比如说在用户点击完后会有反馈显示已发送，在接收到数据后会有发送成功的动效，然后用到了typedjs库展示出机器人回复的打字效果。
 所有这些发起请求和处理响应的函数都封装在一个hook文件夹中，因为要确保跟踪用户的唯一性，所以除了从后端请求获取到用户的gpt请求次数以外，除此之外，对于每个用户会话，也都要加一个唯一标识符，可以让后续的交互能关联到正确的会话，还要获取浏览器指纹，浏览器指纹这里使用Fingereprints库来得到的，(对于API的使用，前端处理的是生产环境使用实际的剩余次数，开发环境默认为5次)
   对于消息处理的结果，会有一个轮询函数不断检查是否有消息被返回，函数里面设置了一个最大调用次数，如果没有消息被正确返回就递归调用自己，然后累加次数，超过指定次数之后重启会话，如果在此之前有消息返回就按照正常步骤处理返回的消息。
    */

/* 2.无限嵌套评论：
 1、数据库的设计：
      在设计数据库表结构之前，首先要考虑很多因素，比如说我现在想实现的功能，评论的结构是要支持无限级的嵌套评论，
      在交互方面要支持评论可删除，添加或编辑(我觉得这个没必要)，同时加入了点赞功能，因为用户的个人信息和评论内容是有关联的，
      所以数据库这边可以关联两张表(一个是存储用户信息的users表，另一个是存储评论信息的comments表)

      1.users用户表
      CREATE TABLE users(
        id INT AUTO_INCREMENT PRIMARY KEY, //用户的唯一标识符
        username VARCHAR(255) NOT NULL,  //用户名
        email VARCHAR(255) NOT NULL UNIQUE,  
        avatar_URL VARCHAR(255), //头像url地址
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP  //记录用户创建评论的时间，默认为当前的时间戳
        ...(其他暂时省略)
      );
      2.评论表
      CREATE TABLE comments(
        id INT AUTO_INCREMENT PRIMARY KEY, //唯一标识每条评论的自增主键
        content TEXT NOT NULL,  //存储评论的文本内容
        author_id INT NOT NULL,  //引用users表的外键，标识这条评论是由哪个用户创建的
        parent_id INT DEFAULT NULL, //用于支持评论的嵌套结构，如果这是一条回复其他评论的评论，则此字段会指向被回复评论的id，如果是顶层评论，则为null
        post_id INT, //这个的用意是关联到特定的帖子或内容上，使每条评论都可以准确指向它所属的文章或内容，从而支持在多个帖子之间区分评论
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
      );


       Books表：
           存储了书籍的详细信息，包括：
           1. id (每本书的唯一标识)
           2. title (书籍标题(题目))
           3. description (书籍描述,简介)
           4. author (书籍作者)
           5. uploader_id(上传书籍的用户id,这是个外键，指向Users表中的id字段) --》表示每本书都有一个上传者，通过 uploader_id链接到Users表，可以追踪是谁上传了这本书
           6. upload_time (书籍上传的时间)
           7. file+path (数据文件本体，它应该是一段url，在mysql中存储的是路径，实际可以存在服务器的文件系统中，或使用云存储服务(Amazon
            S3,Google Cloud Storage))
               【后端要创建一个API，允许前端获取到书籍文件的具体位置(URL)或直接传输文件内容】
                  1.如果文件存储在可公开范围的位置(云存储)，API可以简单返回文件的URL
                  2.如果需要控制文件访问(权限检查)，则API可以直接将文件内容流到前端

        Uses表：
           1. id(主键，唯一标识每个用户)
           2. username(用户名，唯一)
           3. avatar——url(用户头像的链接)
           4. user_level (用户级别，默认为1)

        Comments表：
           1. id(主键，标识每一条评论)
           2. book_id(外键，链接到Books表，指定评论所属的书籍) --》使每条评论都与一本书关联，表明评论是关于哪本书的
           3. parent_id(外键，自引用Comments表，用于建立评论的层级结构，如果是Null，表示是顶层评论)
                    这个字段指向另一条评论的id，当一个用户直接对书籍发表评论时，parent_id字段被设置为null，
                    当一个评论是对另一条评论的回复时，parent_id会被设置为它所回复的那个评论id。
           4. creator_id(连接到Users表，指定评论的创建者)  --》每个评论都有一个作者
           5. content(评论内容)
           6. creation_time (评论创建时间)

      插入评论时，post_id必须被设置为对应书籍的id，这样就确保了每条评论都与特定的书籍相关联，查询评论时，可以通过post_id来筛选出特定数据的所有评论
     tip:在此表中，author_id, parent_id和post_id都设置为外键，以确保数据的一致性和完整性；
        ON DELETE CASCADE：对于author_id和parent_id，当用户或父评论被删除，相应的评论也将自动被删除(防止数据被孤立)
                           对于post_id，如果帖子被删除，所有相关联的评论也会被删除

       后端Nodejs：
       查询评论：
             1.查询相关书籍的所有评论，不考虑层级关系
                SELECT * FROM Comments WHERE book_id = ?
             2.应用层接收到所有评论后，通过检查每条评论的parent_id来决定其在评论树中的位置
 */
function buildNestedComments(comments, parentId = null) {
  return comments
    .filter((comment) => comment.parent_id === parentId)
    .map((comment) => ({
      ...comment,
      replies: buildNestedComments(comments, comment.id),
    }));
}
// 这个函数从顶层评论开始(parent_id为Null开始)，递归地为每条

/*  短信验证：
    1.创建表单，让用户输入手机号，同时验证手机号格式是否正确
    2.请求发送验证码：在用户提交有效的手机号后，前端向后端发送请求，要求后端发送短信验证码到该手机号
      显示一个倒计时或重新发送按钮，限制用户频繁发送请求
    3.用户输入验证码：提供一个输入框让用户填写接收到的短信验证码，可以考虑增加一个输入限制(验证码的有效时间)

 */

/*    第三方登录：
   1.首先到要使用的第三方应用去注册API密钥，然后获得客户端ID和密钥这些东西，当然涉及到认证和令牌交换这些逻辑都是后端实现的，
   2.前端这边主要处理的是用户交互，还有重定向。
     管理重定向：
              当用户点击第三方登录按钮时，前端负责通过重定向或弹窗方式，将用户引导到第三方服务的认证页面
              第三方服务通常会将用户重定向到一个特定的URL(后端提供的回调url)，这一步中，
              前端需正确处理可能附带在url上的认证结果或错误信息 

 */
/* 
    图片断点续传：
 */
