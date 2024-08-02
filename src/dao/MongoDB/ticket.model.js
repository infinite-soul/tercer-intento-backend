import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: { 
    type: String, 
    unique: true, 
    required: true 
  },
  purchase_datetime: { 
    type: Date, 
    default: Date.now 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  purchaser: { 
    type: String, 
    required: true 
  }
});

ticketSchema.pre('save', async function(next) {
  if (!this.code) {
    this.code = await generateUniqueCode();
  }
  next();
});

async function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (await TicketModel.findOne({ code }));
  return code;
}

export const TicketModel = mongoose.model('Ticket', ticketSchema);