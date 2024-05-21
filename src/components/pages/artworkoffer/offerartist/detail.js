import { Helmet } from "react-helmet";
import Layout from "../../../layouts";
import Breadcrumb from "../../../layouts/breadcrumb";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState, useRef } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import { format } from "date-fns";
import Swal from "sweetalert2";
import Loading from "../../../layouts/loading";
import { getAccessToken } from "../../../../utils/auth";
function ArtistOfferDetail() {
    const { offerCode } = useParams();
    const [offerDetail, setOfferDetail] = useState([]);
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadOffer = useCallback(async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAccessToken()}`,
            },
        };

        try {
            const offerResponse = await api.get(url.OFFER.DETAIL_ARTIST_OFFER + `/${offerCode}`, config);
            setOfferDetail(offerResponse.data);
        } catch (error) {
            setError(true);
        }
    }, [offerCode]);

    const handleSubmit = async (action) => {
        const userToken = localStorage.getItem("access_token");
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        try {
            const response = await api.put(`${url.OFFER.UPDATE.replace("{}", offerCode)}`, { action }, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response && response.status === 204) {
                Swal.fire({
                    text: "Offer Approved",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Done",
                });
                setTimeout(() => {
                    navigate(`/offer-artist-list`); //chuyển đến trang offer-list
                }, 2000);
            }
            else {
                Swal.fire({
                    text: "Offer Reject",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Done",
                });
                setTimeout(() => {
                    navigate(`/offer-artist-list`); //chuyển đến trang offer-list
                }, 2000);
            }
        } catch (error) {

            console.error("Error creating test:", error);
            console.error("Response data:", error.response.data);

        }
    };

    useEffect(() => {
        setLoading(true);

        loadOffer();

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [loadOffer]);

    return (
        <>
            <Helmet>
                <title>Offer Detail | Art Admin</title>
            </Helmet>

            {loading ? <Loading /> : ""}

            <Layout>
                <Breadcrumb title="Offer Detail" />
                {/* {error ? (
                    <div className="card">
                        <div className="card-body">
                            <h2>No offer history found. Please check again!</h2>
                            <Link to="/" className="btn btn-rounded btn-primary">
                                <span className="btn-icon-start text-primary">
                                    <i className="fa fa-shopping-cart"></i>
                                </span>
                                Back to Offer
                            </Link>
                        </div>
                    </div>
                ) : ( */}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card mt-3">
                            <div className="card-header">
                                <span className="float-end"> Invoice: #{offerDetail.offerCode}</span>
                                {/* <strong>01/01/2018</strong> */}
                                <span className="float-end"><strong>Status:</strong>{offerDetail.status}</span>
                            </div>
                            <div className="card-body">
                                <div className="row mb-5">
                                    <div className="mt-4 col-xl-3 col-lg-3 col-md-6 col-sm-12 inv-text">
                                        <h4>From:</h4>
                                        <div> <strong>{ }</strong> </div>
                                        <div>Madalinskiego 8</div>
                                        <div>71-101 Szczecin, Poland</div>
                                        <div>Email: info@webz.com.pl</div>
                                        <div>Phone: +48 444 666 3333</div>
                                    </div>
                                    <div className="mt-4 col-xl-3 col-lg-3 col-md-6 col-sm-12 inv-text">
                                        <h4>To:</h4>
                                        <div> <strong>Bob Mart</strong> </div>
                                        <div>Attn: Daniel Marek</div>
                                        <div>43-190 Mikolow, Poland</div>
                                        <div>Email: marek@daniel.com</div>
                                        <div>Phone: +48 123 456 789</div>
                                    </div>

                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th className="center">User ID</th>
                                                <th>User Name</th>
                                                <th>Item</th>
                                                <th>Description</th>
                                                <th className="right">Offer Price</th>
                                                <th className="right">User Offer Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="center text-white">{offerDetail.userId}</td>
                                                <td className="center text-white">{offerDetail.userName}</td>
                                                <td className="left strong text-white">{offerDetail.artWorkNames}</td>
                                                <td className="left text-white">Extended License</td>
                                                <td className="right text-white">${offerDetail.offerPrice}</td>
                                                <td className="right text-white">${offerDetail.toTal}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-sm-5"> </div>
                                    <div className="col-lg-4 col-sm-5 ms-auto">
                                        <table className="table table-clear">
                                            <tbody>
                                                <tr>
                                                    <td className="left"><strong>Total</strong></td>
                                                    <td className="right"><strong>${offerDetail.toTal}</strong><br /></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {(offerDetail.status !== -1 && offerDetail.status !== 1) && (
                                            <div>
                                                <button type="button" className="btn btn-rounded btn-info" onClick={() => handleSubmit('accept')}><span className="btn-icon-check text-info"></span>Accept Offer</button>
                                                <button type="button" className="btn btn-rounded btn-info1" onClick={() => handleSubmit('refuse')}><span className="btn-icon-check text-info"></span>Refuse Offer</button>
                                            </div>
                                        )}
                                        {offerDetail.isPaid === 0 && offerDetail.isPaid !== 1 && (
                                            <div>
                                                <h4>Awaiting payment...</h4>
                                            </div>
                                        )}

                                        {offerDetail.isPaid === 1 && (
                                            <div>
                                                <h4>The Offer #{offerDetail.offerCode} has been paid</h4>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default ArtistOfferDetail;