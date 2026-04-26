const topDiv = document.getElementById("top-div")
const setText = text => topDiv.innerHTML = text

function createEvilPromise() {
    return new Promise(resolve => {
        let count = 0
        const loopUntil300 = () => {
            setText(++count)
            
            if (count >= 300) resolve("Im done!!!!")
            else requestAnimationFrame(loopUntil300)
        }
        loopUntil300()
    })
}

const ohNoATopLevelPromiseISureHopeItDoesntGetAwaited = createEvilPromise()
setText(await ohNoATopLevelPromiseISureHopeItDoesntGetAwaited)

topDiv.addEventListener("click", async () => {
    const result = await createEvilPromise()
    setText(result)
})