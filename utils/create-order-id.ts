export async function createOrderId(amount: number, currency: string) {
    try {
        const response = await fetch('/api/payment/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        console.log("Order Response:", data);
        return data.orderId;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create order");
    }
}