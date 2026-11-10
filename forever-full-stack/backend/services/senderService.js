const senderRequest = async (path, { method = 'GET', body } = {}) => {
    const apiToken = process.env.SENDER_API_TOKEN
    if (!apiToken) {
        throw new Error('Sender API token is not configured')
    }

    const requestMethod = method.toUpperCase()
    const response = await fetch(`https://api.sender.net/v2/${path}`, {
        method: requestMethod,
        headers: {
            Authorization: `Bearer ${apiToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(10000)
    })

    const responseBody = await response.json().catch(() => null)
    if (!response.ok) {
        const error = new Error(`Sender API request failed: ${requestMethod} /v2/${path} returned ${response.status}`)
        error.status = response.status
        error.providerMessage = typeof responseBody?.message === 'string'
            ? responseBody.message
            : undefined
        throw error
    }

    return responseBody
}

const sendTransactionalEmail = async ({ to, subject, html, text }) => {
    const fromEmail = process.env.SENDER_FROM_EMAIL
    const fromName = process.env.SENDER_FROM_NAME || 'Clothes For You'
    if (!fromEmail) {
        throw new Error('Sender from address is not configured')
    }

    return senderRequest('message/send', {
        method: 'POST',
        body: {
            from: { email: fromEmail, name: fromName },
            to: { email: to },
            subject,
            html,
            text
        }
    })
}

export { senderRequest, sendTransactionalEmail }
