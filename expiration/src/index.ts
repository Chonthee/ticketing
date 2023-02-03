import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () =>{

  // Connect to NATS_CLIENT_ID
  if(!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID must be defined')
  }

  // Connect to NATS_URL
  if(!process.env.NATS_URL){
    throw new Error('NATS_URL must be defined')
  }

  // Connect to NATS_CLUSTER_ID
  if(!process.env.NATS_CLUSTER_ID){
    throw new Error('NATS_CLUSTER_ID must be defined')
  }

    // Connect to REDIS_HOST
    if(!process.env.REDIS_HOST){
      throw new Error('REDIS_HOST must be defined')
    }

  try{
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  }
  catch(err){
    console.log(err);
  }
};

start();

