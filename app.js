
const submitbutton = document.querySelector('#submit')


async function getMessage() {
    console.log('clicked')
    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ${process.env.API_KEY}',
            'Content-Type': 'application/json'

        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{role: "user",content: "You are a helpful assistant."}],
            max_tokens: 100
        })
    }
    try{
        const resp = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await resp.json()
        console.log(data)
    }catch(error) {
        console.log(error)
    }
}

submitbutton.addEventListener('click',getMessage)