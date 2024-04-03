撤销重做：

present = "xss" //存储当前输入框的值
past = ['x','xs'] //历史数据的记录
future = ['xss'] //未来数据的记录

如果在一个输入框中输入内容'x',那么当前的内容就应该是'x',同时主动改变历史数据的记录，将内容'x'插入到数组 past 中，如果此时输入框中内容仍然有变化，比如改为'xs',那么应该在 past 数组中再插入一条'xs'

撤销时：
past 出栈  
future 入栈  
present 重新复制

重做：
future 出栈
past 入栈
present 重新赋值

输入：
past 入栈
future 清空
(撤销完之后重新输入，future 内的值作废)

<!-- redux-undo是一个redux的高阶reducer，用于为reduc状态添加撤销(undo)和重做(redo)功能，适合需要历史记录功能的应用，如编辑器或游戏




 -->
