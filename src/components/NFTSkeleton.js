import React from 'react'
// import {Spin} from "antd"
// import {LoadingOutlined} from "@ant-design/icons"

const NFTSkeleton = ({className = '', minHeight = 230}) => {
    return (
        // <div className={`${className}`} style={{backgroundColor: '#4ccbc914', borderRadius: 8, minHeight}}>
        <div className={`${className} justify-start animate-pulse`}>
            {/*<Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>*/}
            <div
                className="flex justify-center items-center w-full aspect-square bg-gray-300 dark:bg-gray-700" style={{borderRadius: 5}}>
                <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg"
                     aria-hidden="true" fill="currentColor" viewBox="0 0 640 512">
                    <path
                        d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/>
                </svg>
            </div>
            {/*<div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>*/}
            {/*    <span className={'secondary-color text-center'}>MoonFit</span>*/}
            {/*    <span className={'primary-color text-center mt-1'}>NFT</span>*/}
            {/*    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2 mt-2"></div>*/}
            {/*</div>*/}
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4 mt-4"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2 mt-2 mb-0.5"></div>
            {/*<div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/3 mt-2"></div>*/}
            <div className="h-2.5 bg-gray-200 rounded dark:bg-gray-700 w-4/5 mt-5"></div>
        </div>
    )
}

export default NFTSkeleton