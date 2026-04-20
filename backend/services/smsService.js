const twilio = require('twilio');
const logger = require('../utils/logger');

let client = null;

const getClient = () => {
  if (client) return client;

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error(
      'Twilio credentials missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.'
    );
  }

  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  return client;
};

const sendSMS = async (to, body) => {
  try {
    const twilioClient = getClient();

    const response = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    logger.info(`SMS sent to ${to} | SID: ${response.sid}`);
    return { success: true, sid: response.sid };
  } catch (err) {
    logger.error(`Twilio send failed for ${to}: ${err.message}`);
    return { success: false, error: err.message };
  }
};

module.exports = { sendSMS };
