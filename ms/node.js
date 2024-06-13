const express = require("express");
const mysql = require("/xx");
const bodyParser = require("body-parser");
const redis = require("redis");
const { error } = require("console");

const redisClient = redis.createClient({
  url: "redis://locakhost:6379", //redis服务器的url
});
redisClient.connect();
redisClient.on("error", (err) => console.log("Redis Client Error", err));

const app = express();
app.use(bodyParser.json());

//连接数据库
const pool = mysql.createPool({
  host: "localhost",
  user: "dohkyungsoo",
  password: "mysql",
  database: "myDataBase",
});

// 给前端返回的评论内容(这个路径应该和前端约定好哈)
app.get("/post/:postId.comments", async (req, res) => {
  const { postId } = req.params;
  const cacheKey = `comments:${postId}`;
  try {
    // 尝试从redis获取评论
    const cachedComments = await redisClient.get(cacheKey);
    if (cachedComments) {
      console.log("Using cached data");
      res.json(JSON.parse(cachedComments));
      return;
    }
    // 没有缓存数据
    const [comments] = await pool.query(
      "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at",
      [postId]
    );
    // 将评论数据存入redis，并设置过期时间
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(comments)); //缓存一个小时
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch comments");
  }
});

// 当添加或删除评论时，需要更新Redis中的缓存以保持数据的一致性(任何与评论相关的操作都会被处理)
// 缓存清除：任何改变数据状态的操作(添加，删除)，都应该移除或更新到缓存数据，以避免读到旧数据
// 【确保即使评论有嵌套结构，相关联的所有缓存也能被清理，可以通过在删除操作后查询这条评论所属的帖子id，然后删除相关的缓存】
app.post("/comments", async (req, res) => {
  const { content, author_id, parent_id, post_id } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO comments (content,author_id, parent_id, post_id) VALUES (?,?,?,?)",
      [content, author_id, parent_id, post_id]
    );
    res.status(201).json({
      id: result.insertId,
      content,
      author_id,
      parent_id,
      post_id,
      created_at: new Date(),
    });
    const cacheKey = `comments:${post_id}`;
    await redisClient.del(cacheKey);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add comment");
  }
});

app.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // 获取评论的post_id，以便知道哪个帖子的缓存需要清除
    const [commentDetails] = await pool.query(
      "SELECT post_id FROM comments WHERE id = ?",
      [id]
    );
    if (commentDetails.length === 0) {
      return res.status(404).send("Comment not found");
    }
    const post_id = commentDetails[0].post_id;
    const [result] = await pool.query("DELETE FROM comments WHERE id = ?", [
      id,
    ]);
    // 评论删除成功后，清除相关的缓存
    const cacheKey = `comments:${post_id}`;
    await redisClient.del(cacheKey);
    res.send("Comment deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failded to delete comment");
  }
});
