import json
import os

from kafka import KafkaProducer


KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
PAYMENT_EVENTS_TOPIC = os.getenv("PAYMENT_EVENTS_TOPIC", "payment_events")


def _create_producer():
    return KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_serializer=lambda value: json.dumps(value).encode("utf-8"),
        key_serializer=lambda value: str(value).encode("utf-8"),
    )


def publish_payment_success(order_id: str, user_id: str, amount: int):
    message = {
        "event": "payment.succeeded",
        "order_id": order_id,
        "user_id": user_id,
        "amount": amount,
    }

    producer = _create_producer()
    try:
        producer.send(
            PAYMENT_EVENTS_TOPIC,
            key=order_id,
            value=message,
        ).get(timeout=10)
        producer.flush()
        print(f"Published payment success event for order_id={order_id}")
    finally:
        producer.close()
