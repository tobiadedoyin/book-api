import axios from 'axios';
import Env from '../../shared/utils/env';

export async function verifyTransaction(transactionId: string) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${Env.get<string>('PAYSTACK_SECRET_KEY')}`,
        },
      }
    );

    console.log('Transaction verified:', response.data);
    return response.data.data;
  } catch (error) {
    console.error(
      'Error verifying transaction:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function initializePayment(paystackPayload: any) {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      paystackPayload,
      {
        headers: {
          Authorization: `Bearer ${Env.get<string>('PAYSTACK_SECRET_KEY')}`,
        },
      }
    );

    return response.data.data.authorization_url;
  } catch (error) {
    throw new Error(
      `Payment initialization failed: ${
        error?.response?.data?.message || error.message
      }`
    );
  }
}
