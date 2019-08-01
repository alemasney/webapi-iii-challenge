const express = require('express');

const users = require('./userDb.js');

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
    try {
        const newUser = await users.insert(req.body);

        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/:id/posts', validateUserId, async (req, res) => {
    try {
        const newPost = await users.update(req.params.id, req.body);
        if(newPost) {
            res.status(200).json(newPost);
        }
    } catch (error) {
        res.status(500).json({ error: 'fix me'});
    }
});

router.get('/', (req, res) => {
    users.get()
        .then( user => {
            res.status(200).json(user);
        })
        .catch( error => {
            res.status(500).json(error);
        })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        const userPosts = await users.getUserPosts(req.params.id);

        if (userPosts) {
            res.status(200).json(userPosts)
        }
    } catch (error) {
        res.status(200).json(error);
    }

});

router.delete('/:id',validateUserId, async (req, res) => {
    try {
        const removeUser = await users.remove(req.params.id);

        if(removeUser) {
            res.status(200).json(removeUser)
        }
    } catch(error) {
        res.status(500).json(error);
    }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
    try {
        const update = await users.update(req.params.id, req.body)

        if(update) {
        res.status(200).json(req.body)
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    try {
        const {id} = req.params;

        const userId = await users.getById(req.params.id);

        if(userId) {
            req.user = userId;
            next();
        } else {
            res.status(400).json({ message: 'invaild user id'});
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

function validateUser(req, res, next) {
    
    if (req.body) {
        next();
    } else if(!req.body) {
        res.status(400).json({ message: 'missing user data.' });
    } else {
        res.status(400).json({ message: 'missing required name field'})
    }
};

function validatePost(req, res, next) {

    if (req.body) {
        next();
    } else if (!req.body) {
        res.status(400).json({ message: 'missing post data.' });
    } else {
        res.status(400).json({ message: 'missing required text field' })
    }
};

module.exports = router;
