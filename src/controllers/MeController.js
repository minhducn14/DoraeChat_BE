const User = require('../models/User');
const MeService = require('../services/MeService');
const CustomError = require('../exceptions/CustomError');
const NotFoundError = require('../exceptions/NotFoundError');
const { console } = require('inspector');
const fs = require('fs').promises;

const UserController = {

    async getById(req, res, next) {
        try {
            const { id } = req.body;
            const user = await MeService.getById(id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async updateUser(req, res, next) {
        try {
            const user = req.body;
            const updatedUser = await MeService.updateUser(user.id, user);
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    },
    
    async updateAvatarUser(req, res, next) {
        try {
            const { id } = req.body;
            const updatedUser = await MeService.updateAvatarUser(id, req.file);    
            
            res.json({ message: 'User avatar is updated successfully!', avatar: updatedUser.avatar });
        } catch (error) {
            next(error);
        }
    },

    async updateCoverUser(req, res, next) {
        try {
            const { id } = req.body;
            const updatedUser = await MeService.updateCoverUser(id, req.file);    
            
            res.json({ message: 'User cover is updated successfully!', cover: updatedUser.cover });
        } catch (error) {
            next(error);
        }
    },

    async updatePassword(req, res, next) {
        try {
            const { id, oldPassword, newPassword } = req.body;
            await MeService.updatePassword(id, oldPassword, newPassword);
            res.json({ message: 'Password is updated' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = UserController;
