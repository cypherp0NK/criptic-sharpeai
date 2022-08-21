import {useContext, useEffect, useState} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"

export const poolChart1 = () =>{
  const LiquidityData = [{
        dailyVolumeUSD: 334,
        date: 1622851200,
        totalLiquidityUSD: '3922395813',
        name: '06',
      },]
      
  
  return{LiquidityData}
}