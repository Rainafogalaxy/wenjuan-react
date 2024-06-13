<!-- 1.gpt交互:
首先是在页面中嵌入一个与gpt对话的模块，它是一个单独的组件，整个对话框中的一些初始状态基本上是写死的，比如说一开始机器人的说话内容展示的就是根据当前页面的公司或人员信息的简单介绍，用户可以点击一些提供的固定内容给机器人发送相应的问题，然后像服务器端发送请求，前端这边根据返回的数据，和发送中的状态，来设置对应的交互效果和展示，比如说在用户点击完后会有反馈显示已发送，在接收到数据后会有发送成功的动效，然后用到了typedjs库展示出机器人回复的打字效果。
 所有这些发起请求和处理响应的函数都封装在一个hook文件夹中，因为要确保跟踪用户的唯一性，所以除了从后端请求获取到用户的gpt请求次数以外，除此之外，对于每个用户会话，也都要加一个唯一标识符，可以让后续的交互能关联到正确的会话，还要获取浏览器指纹，浏览器指纹这里使用Fingereprints库来得到的，(对于API的使用，前端处理的是生产环境使用实际的剩余次数，开发环境默认为5次)
   对于消息处理的结果，会有一个轮询函数不断检查是否有消息被返回，函数里面设置了一个最大调用次数，如果没有消息被正确返回就递归调用自己，然后累加次数，超过指定次数之后重启会话，如果在此之前有消息返回就按照正常步骤处理返回的消息。
   
   
2.无限嵌套评论：
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
     tip:在此表中，author_id, parent_id和post_id都设置为外键，以确保数据的一致性和完整性；
        ON DELETE CASCADE：对于author_id和parent_id，当用户或父评论被删除，相应的评论也将自动被删除(防止数据被孤立)
                           对于post_id，如果帖子被删除，所有相关联的评论也会被删除

       后端Nodejs：
    -->