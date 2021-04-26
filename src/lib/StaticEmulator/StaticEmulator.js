// This file takes an object ID and assigns it an image
// @author Brett Collins

// Imports all of the image data
import img1 from './assets/greener.png'
import img2 from './assets/mossy.png'
import img3 from './assets/redpill.png'
import img4 from './assets/revenge.png'
import img5 from './assets/kitty.jpeg'
import img6 from './assets/realestate.jpeg'
import img7 from './assets/neo.jpeg'
import img8 from './assets/cybercar.jpeg'

const images = [ img1, img2, img3, img4, img5, img6, img7, img8 ]

const StaticEmulator = (id) => {
    console.log(id)
    const randIndex = Math.round(randomIndexFromSeed(id))
    console.log(randIndex)
    return images[randIndex % images.length]
}

const randomIndexFromSeed = (id) => {
    const min = 0
    const max = images.length - 1

    id = parseInt(id.split('').map(c => c.charCodeAt(0).toString(2)).join(''))
    const rand = ((id * 9301 + 49297) % 233280) / 233280

    return rand * max * 100
}

export default StaticEmulator