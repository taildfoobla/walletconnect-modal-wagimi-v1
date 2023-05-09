import React, { useContext, useEffect, useState } from "react"
import { Tag } from "antd"
import WalletAuthContext from "../../contexts/WalletAuthContext";
import arrowFatRight from "../../assets/images/icons/ArrowFatRight.svg"
import moonBeam from "../../assets/images/icons/moonbeam.svg"

import Paths from "../../routes/Paths"
import { Link } from "react-router-dom";
import { NFT_SALE_ROUNDS_INFO } from '../../constants/blockchain'
import {
    getAvailableSlots,
} from "../../services/smc-ntf-sale-round-34";

const currentRoundSale = NFT_SALE_ROUNDS_INFO.R3

const Round3 = () => {
    const { isConnected, showWalletSelectModal } = useContext(WalletAuthContext)
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(true)
    const [isSoldOut, setIsSoldOut] = useState(false)
    const maxAmountRound = currentRoundSale.amount

    useEffect(() => {
        init().then()
    }, [])

    const init = async () => {
        setIsLoading(true)

        const availableSlots = await getAvailableSlots()

        setIsSoldOut(availableSlots === 0)

        setTimeout(() => {setIsLoading(false)}, 0)
    }

    // eslint-disable-next-line no-unused-vars
    const dateTitle = (dateMsg) => {
        const day = dateMsg.substring(0, 2)
        const ordinalNumber = dateMsg.substring(2, 4)
        const month = dateMsg.substring(5, dateMsg.length)

        return (
            <>
                <div className="flex">
                    <h1>{day}</h1>
                    <h3 className="pt-2">{ordinalNumber}</h3>
                </div>
                <h3>{month}</h3>
            </>
        )
    }

    const joinButton = () => {
        if (isSoldOut) {
            return (
                <Link to={Paths.NFTSaleRoundThree.path} className="flex items-center header-button button button-secondary w-100" style={{marginTop: '7rem'}}>
                    <span className="nav-text">View detail</span>
                </Link>
            )
        }
        if (isConnected) {
            return (
                <Link to={Paths.NFTSaleRoundThree.path} className="flex items-center header-button button button-secondary w-100" style={{marginTop: '7rem'}}>
                    <span className="nav-text">Join now</span>
                </Link>
            )
        }

        return (
            <button type="button" className="flex items-center header-button button button-secondary w-100" style={{marginTop: '7rem'}}
                    onClick={showWalletSelectModal}>
                Login
            </button>
        )
    }

    return (
        <div className={`stage${isSoldOut && !currentRoundSale.activeSoldOut ? " sold-out" : ""}`}>
            {
                isSoldOut && <Tag className="badge" color="#541C8D">SOLD OUT</Tag>
            }
            <div className="stage-content">
                {dateTitle(currentRoundSale.dateMsg)}
                <h4 className="mt-5 mb-3">{currentRoundSale.title}</h4>
                <div className="flex mb-2">
                    <img className="arrow-right" src={arrowFatRight} alt="" />
                    QUANTITY:
                    <span className="text-white ml-1">UP TO {maxAmountRound} NFTs</span>
                </div>
                <div className="flex mb-3">
                    <img className="arrow-right" src={arrowFatRight} alt="" />
                    PRICE:
                    <img className="ic-moonbeam" src={moonBeam} alt="" />
                    <span className="text-[#4ccbc9] mr-1">FROM {currentRoundSale.price}</span>
                </div>
                <span className="description">{currentRoundSale.description}</span>
            </div>
            {joinButton()}
        </div>
    )
}

export default Round3
