require('dotenv').config()
const { default: axios } = require('axios');
const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 5000;

top_stories_endpoint="https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
best_stories_endpoint="https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty"
new_stories_endpoint="https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"

app.use(cors())

const getStoryDetailUrl = (id) => {
    return `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
}

const getStoryList = async (idList) => {
    const storyList = [];

    // for (let i = 0; i < idList.length; i++) {
    //     const storyUrl = getStoryDetailUrl(idList[i])
    //     const story = await axios.get(storyUrl);
    //     storyList.push(story.data);
    // }

    await Promise.all(
        idList.map((id) =>
            new Promise(async (resolve, reject) => {
                try {
                    const storyUrl = getStoryDetailUrl(id)
                    const story = await axios.get(storyUrl);
                    storyList.push(story.data);
                } catch (error) {
                }finally {
                    resolve();
                }
            })
        )
    )
    return storyList;
}

app.get('/topstories', async (req, res) => {
    try {
        const offset = parseInt(req.query.offset, 10);
        const limit = parseInt(req.query.limit, 10);
        console.log(offset, limit)
        const idData = await axios.get(top_stories_endpoint);
        const idList = idData.data.slice(offset, offset + limit);
        console.log(idData.data.length)
        console.log(idList.length)
        const storyList = await getStoryList(idList);
        res.send({
            success: true,
            data: {
                stories: storyList
            }
        });
    } catch (error) {
        res.send({
            success: false,
            message: error?.message || "Something went wrong"
        });
    }
})

app.get('/beststories', async (req, res) => {
    try {
        const offset = parseInt(req.query.offset, 10);
        const limit = parseInt(req.query.limit, 10);
        const idData = await axios.get(best_stories_endpoint);
        const idList = idData.data.slice(offset, offset + limit);
        const storyList = await getStoryList(idList);
        res.send({
            success: true,
            data: {
                stories: storyList
            }
        });
    } catch (error) {
        res.send({
            success: false,
            message: error?.message || "Something went wrong"
        });
    }
})

app.get('/newstories', async (req, res) => {
    try {
        const offset = parseInt(req.query.offset, 10);
        const limit = parseInt(req.query.limit, 10);
        const idData = await axios.get(new_stories_endpoint);
        const idList = idData.data.slice(offset, offset + limit);
        const storyList = await getStoryList(idList);
        res.send({
            success: true,
            data: {
                stories: storyList
            }
        });
    } catch (error) {
        res.send({
            success: false,
            message: error?.message || "Something went wrong"
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})