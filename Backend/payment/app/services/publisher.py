import json
import pika # or any other broker library

def publish_payment_success(order_id: str, user_id: str, amount: int):
    # Setup connection to your message broker (RabbitMQ example)
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq-server'))
    channel = connection.channel()
    
    channel.queue_declare(queue='payment_events')
    
    message = {
        "event": "payment.succeeded",
        "order_id": order_id,
        "user_id": user_id,
        "amount": amount
    }
    
    channel.basic_publish(exchange='', routing_key='payment_events', body=json.dumps(message))
    connection.close()