import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';


function Bookingscreen({ match }) {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState();
  // let { roomid,fromdate,todate } = useParams();

  // console.log(fromdate);
  // const roomid = match.params.roomid;
  // const fromdate = moment(match.params.fromdate, "DD-MM-YYYY");
  // const todate = moment(match.params.todate, "DD-MM-YYYY");
  // const day = todate.diff(fromdate);
  // console.log(day);
  // const totaldays = moment.duration(day, 'totaldays').asDays() + 1;
  let { roomid, fromdate, todate } = useParams();
  // console.log(fromdate);
console.log(todate);
  fromdate = moment(fromdate, 'DD-MM-YYYY');
  todate = moment(todate, 'DD-MM-YYYY');
const totaldays = moment.duration(todate.diff(fromdate)).asDays()+1;
fromdate = fromdate.format('DD-MM-YYYY');
todate = todate.format('DD-MM-YYYY');
// console.log(fromdate);
// console.log(todate);
// console.log(totaldays);
  const [totalamount, settotalamount] = useState();

  useEffect(() => {
    async function fetchData() {
    try {
      setloading(true);
      const response = (
        await axios.post("/api/rooms/getroombyid", {
          roomid: roomid,
        })
      );
      const data = response.data;
      settotalamount(data.rentperday * totaldays);
      // console.log(data);
      setroom(data);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(true);
    }
  }
  fetchData();
}, []);

  async function onToken(token) {
    const bookingDetails = {
      room,
      user: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token,
    };

    console.log(bookingDetails);
    console.log(token);

    try {
      setloading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setloading(false);
      Swal.fire(
        "Congratulations!",
        "Your room is successfully booked",
        "success"
      );
    } catch (error) {
      setloading(false);
      Swal.fire("Oops!", "Something went wrong", "error").then((result) => {
        window.location.href = "/bookings";
      });
    }
  }

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>
                    Name: {JSON.parse(localStorage.getItem("currentUser")).name}
                  </p>
                  <p>From: {fromdate}</p>
                  <p>To: {todate}</p>
                  <p>Max Count: {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total Days: {totaldays}</p>
                  <p>Rent per day: {room.rentperday}</p>
                  <p>Total Amount: {totalamount}</p>
                </b>
              </div>
              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalamount * 100}
                  token={onToken}
                  currency="INR"
                  stripeKey="pk_test_51M5ZaASDJfvzyPiCaR4yahFAtA29NSO15MMwJfeLXWSZPjE5EON8z7AagtmDI9DjlVTOynCss55LrJkwmwaZeBeu003b5Vj2lE"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
