const users = {
    frank : {
        name: 'Frank Wilder',
        img: 'assets/dp/fake01.jpg'
    },
    ccat : {
        name: 'C-Cat',
        img: 'assets/dp/fake02.jpg'
    },
    hypno : {
        name: 'Hypno Wilder',
        img: 'assets/dp/fake03.jpg'
    }
}

const nfts = [
    {
        creator: users.frank,
        owner: users.frank,
        name: 'Blue Pill/Red Pill',
        img: 'assets/nft/redpill.png',
        price: '250',
    },
    {
        creator: users.frank,
        owner: users.frank,
        name: `Satoshi's Revenge`,
        img: 'assets/nft/revenge.png',
        price: '250',
    },
    {
        creator: users.frank,
        owner: users.ccat,
        name: `The Grass Is Greener`,
        img: 'assets/nft/greener.png',
        price: '250',
    },
    {
        creator: users.frank,
        owner: users.hypno,
        name: `Mossy Haven`,
        img: 'assets/nft/mossy.png',
        price: '250',
    },
]

const getAll = () => nfts
const getOwnedBy = (user) => nfts.filter(n => n.owner.name === user)
const getCreatedBy = (user) => nfts.filter(n => n.creator.name === user)

export default { getAll, getOwnedBy, getCreatedBy }