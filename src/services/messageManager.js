import MessageModel from '../dao/MongoDB/messages.model.js';

class MessageManager {
    async getMessages() {
        try {
            const messages = await MessageModel.find().sort({ timestamp: -1 });
            return messages;
        } catch (err) {
            console.error('Error al obtener los mensajes:', err);
            throw err;
        }
    }

    async addMessage(messageData) {
        try {
            const message = new MessageModel(messageData);
            await message.save();
            return message;
        } catch (err) {
            console.error('Error al agregar el mensaje:', err);
            throw err;
        }
    }
}

export default MessageManager;

