import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'usehooks-ts';
import { MobileNavbar, FootballLeagueNavbar, MobileFooter, LeagueContent, OddDetailPanel } from '../../../mobile/components'
import { getMatches } from '../../../store/actions/mobileSportsActions';
import {FadeInOut} from "../../../utils";
import './mHome.css'
const tipTypesList = [
    [1, 'X', 2],
    [1, 'X', 2],
    ['Over', 'Under'],
    [1, 'X', 2],
    [1, 'X', 2],
    ['1X', 12, 'X2'],
    ['Yes', 'No'],
]
function MHome() {

    const dispatch = useDispatch()
    const [tipTypes, setTipTypes] = useState();
    const [leagueType, setLeagueType] = useState([]);
    const [openOddDetailVal, setOpenOddDetailVal] = useState(false);
    const [selectMatchId, setSelectMatchId] = useState();
    const [sportActive, setSportActive] = useState(1);
    const prevScrollY = useRef(0)
    const [hideSubNav, setHideSubNav] = useState(true);
    // const [betCollectorHome, setBetCollectorHome] = useState([]);
    const get_Matches = useSelector(state => state.mobileSportsReducers.getMatches)
    useEffectOnce(() => {
        dispatch(getMatches())
    })
    useEffect(() => {
        let tempType = leagueType;
        if (get_Matches && get_Matches.length !== 0) {
            get_Matches.data.matches.forEach(item => {
                if (!tempType.includes(item.match.league)) {
                    tempType.push(item.match.league)
                }
            });
            setLeagueType(tempType);
        }

    }, [get_Matches])

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (prevScrollY.current < (currentScrollY - 15) && hideSubNav) {
                setHideSubNav(false);
            }
            if (prevScrollY.current > currentScrollY && !hideSubNav) {
                setHideSubNav(true);
            }
            prevScrollY.current = currentScrollY;
        }
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, [hideSubNav])

    const getTipTypes = (data) => {
        setTipTypes(data);
    }
    const openDetailOdd = (index, id) => {
        setOpenOddDetailVal(index);
        setSelectMatchId(id);
    }
    const sportActiveFunc = (index) => {
        setSportActive(index);
    }
    // useEffect(() => {
    //     console.log('hello');
    // }, [betCollectorHome])
    // const betCollectListFunc = (betCollectList, obj) => {
    //     let tempBetCollectList = [];
    //     tempBetCollectList = betCollectList;
    //     if (tempBetCollectList && tempBetCollectList.length > 0) {
    //         let flag = false;
    //         tempBetCollectList.forEach((item, index) => {
    //             if (item.matchId === obj.matchId) {
    //                 item.odds.includes(...obj.odds) ? arrayRemove(item.odds, item.odds.indexOf(...obj.odds)) : item.odds.push(...obj.odds);
    //                 return flag = true;
    //             }
    //         });
    //         if (flag === false) {
    //             tempBetCollectList.push(obj)
    //         }
    //     }
    //     else {
    //         tempBetCollectList.push(obj)
    //     }
    //     console.log('betCollectListFunc', tempBetCollectList);
    //     setBetCollectorHome(tempBetCollectList);
    // }
    return (
        <>
            <MobileNavbar sportActiveFunc={sportActiveFunc} />
            {sportActive === 1 && hideSubNav ? 
                <FadeInOut show="true" duration={400}>
                    <FootballLeagueNavbar parentCallback={getTipTypes} sportActive={sportActive} /> 
                </FadeInOut>
                : <></>}
            <div className={sportActive === 1 ? 'm_content custom-top' : 'm_content'}>
                <div className='m_header'>
                    <div className='odds'>
                        {tipTypes !== undefined ? tipTypesList[tipTypes].map((item, index) => <p key={index}>{item}</p>) : null}
                    </div>
                </div>
                <div className='m_body'>
                    {leagueType ? leagueType.map((league, index) => <>
                        <div key={index} className="league-content">{league}</div>
                        {get_Matches && get_Matches.length !== 0 ? get_Matches.data.matches.map((match, i) => (
                            league === match.match.league ?
                                <div key={i}>
                                    <LeagueContent
                                        openDetailOdd={openDetailOdd}
                                        matchId={match.id}
                                        homeTeam={match.match.homeTeam}
                                        awayTeam={match.match.awayTeam}
                                        matchResults={match.matchResults}
                                        score={match.scoreCache}
                                        status={0}
                                        // status={match.matchResults.fullTimeResult ? match.matchResults.fullTimeResult : match.matchResults.interimResults ? match.matchResults.interimResults : null}
                                        redCard={match.redCards}
                                        betState={match.betState}
                                        isTop={match.isTop}
                                        odds={match.betState}
                                    // selected={betCollectListFunc}
                                    // betCollectorHome={betCollectorHome}
                                    />
                                </div>
                                : null
                        )
                        ) : null}
                    </>
                    ) : null}
                </div>
            </div>
            <MobileFooter />
            {openOddDetailVal ? <OddDetailPanel openDetailOdd={openDetailOdd} matchId={selectMatchId} /> : <></>}
        </>
    );
};
export default MHome;