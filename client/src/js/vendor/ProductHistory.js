import React, { useContext, useState } from "react";
import { AppContext } from "../App";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import boba from '../../static/img/uciboba.jpeg';
import StateEnum from '../StateEnum.js';

function ProductHistory(props) {
    const {web3, contract, accountId} = useContext(AppContext);
    const localWeb3 = web3[0];
    const localContract = contract[0];
    const [timestamps, setTimestamps] = useState([]);

    React.useEffect(() => {
        console.log("rketan:", props.product.productID)
        const getProductTimeLine = async () => {
            let localStamps = [];
            let states = ["Manufactured", "OrderPlaced", "Shipped", "DistRecieved", "InTransit", "VendorRecieved", "Purchased"]

            if (localContract !== undefined && localContract.methods !== undefined) {
                for(let i = 0; i < 7; i++) {
                    let productMapping = await localContract.methods.productStamp(props.product.productID, states[i]).call();
                    console.log("rketan: i : " + i + " :" + productMapping)
                    localStamps.push(productMapping/1000)
                }
            }

            setTimestamps(localStamps);
        } 

        getProductTimeLine().catch(console.error);
    }, []);

    function convertTimeToDate(time) {
        var d = new Date(0);
        d.setUTCSeconds(time);
        return d.toUTCString();
    }

    return (
        <>
            <VerticalTimeline>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    //contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                    date={convertTimeToDate(timestamps[0])}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}>
                    <h3 className="vertical-timeline-element-title">{StateEnum[0]}</h3>
                    {/* <h4 className="vertical-timeline-element-subtitle">Timestamp : {convertTimeToDate(timestamps[0])}</h4> */}
                    <p>
                        Product {props.product.name} is Manufactured by {props.product.entityNames.manufacturerName}.
                    </p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={convertTimeToDate(timestamps[1])}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    // icon={boba}
                >
                    <h3 className="vertical-timeline-element-title">{StateEnum[1]}</h3>
                    {/* <h4 className="vertical-timeline-element-subtitle">Timestamp : {timestamps[1]}</h4> */}
                    <p>
                    Product Order is Placed by Vendor {props.product.entityNames.vendorName}.
                    </p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={convertTimeToDate(timestamps[2])}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    // icon={boba}
                >
                    <h3 className="vertical-timeline-element-title">{StateEnum[2]}</h3>
                    {/* <h4 className="vertical-timeline-element-subtitle">Timestamp : {timestamps[2]}</h4> */}
                    <p>
                    Product is Shipped to Distributor {props.product.entityNames.distributorName}.
                    </p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={convertTimeToDate(timestamps[3])}
                    iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                    // icon={boba}
                >
                    <h3 className="vertical-timeline-element-title">{StateEnum[3]}</h3>
                    {/* <h4 className="vertical-timeline-element-subtitle">Timestamp : {timestamps[3]}</h4> */}
                    <p>
                    Product Received to Distributor {props.product.entityNames.distributorName}.
                    </p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                    className="vertical-timeline-element--education"
                    date={convertTimeToDate(timestamps[4])}
                    iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                    // icon={boba}
                >
                    <h3 className="vertical-timeline-element-title">{StateEnum[4]}</h3>
                    {/* <h4 className="vertical-timeline-element-subtitle">Timestamp : {timestamps[4]}</h4> */}
                    <p>
                    Product is Shipped to Vendor {props.product.entityNames.vendorName}.
                    </p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                    className="vertical-timeline-element--education"
                    date={convertTimeToDate(timestamps[5])}
                    iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
                    // icon={boba}
                >
                    <h3 className="vertical-timeline-element-title">{StateEnum[5]}</h3>
                    {/* <h4 className="vertical-timeline-element-subtitle">Timestamp : {timestamps[5]}</h4> */}
                    <p>
                    Product Received by Vendor {props.product.entityNames.vendorName}.
                    </p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                    className="vertical-timeline-element--education"
                    date={convertTimeToDate(timestamps[6])}
                    iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff'}}
                    // icon={boba}
                >
                    <h3 className="vertical-timeline-element-title">{StateEnum[6]}</h3>
                    {/* <h4 className="vertical-timeline-element-subtitle">Timestamp : {timestamps[6]}</h4> */}
                    <p>
                        Product Purchased from Vendor {props.product.entityNames.vendorName}
                    </p>
                </VerticalTimelineElement>
            </VerticalTimeline>
        </>
    );
}

export default ProductHistory;