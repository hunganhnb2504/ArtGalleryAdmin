import Layout from "../../../layouts/index";
import Breadcrumb from "../../../layouts/breadcrumb";
import { Link, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "../../../services/api";
import url from "../../../services/url";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import Loading from "../../../layouts/loading";
import NotFound from "../../../pages/other/not-found";
function ArtistOfferList() {

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [offers, setOffers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const loadOffer = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const offerResponse = await api.get(url.OFFER.LIST_ARTIST_OFFER);
                const filteredOffers = selectedDate
                    ? offerResponse.data.filter((item) => format(new Date(item.createdAt), "yyyy-MM-dd") === format(new Date(selectedDate), "yyyy-MM-dd"))
                    : offerResponse.data;
                setOffers(filteredOffers);
            } catch (error) { }
        };
        loadOffer();
    }, [selectedDate]);

    //paginate
    const [currentPage, setCurrentPage] = useState(1);
    const offersPerPage = 5;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const totalPages = Math.ceil(offers.length / offersPerPage);
    const indexOfLastOffer = currentPage * offersPerPage;
    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
    const currentOfferCode = offers.slice(indexOfFirstOffer, indexOfLastOffer);

    //search, filter
    const [searchCode, setSearchCode] = useState("");
    const handleSearchCodeChange = (e) => {
        setSearchCode(e.target.value);
    };
    const filteredCodes = currentOfferCode.filter((item) => {
        const codeMatch = typeof item.offerCode === 'string' && item.offerCode.toLowerCase().includes(searchCode.toLowerCase());
        return codeMatch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return "bg-warning";
            case 1:
                return "bg-success";
            case -1:
                return "bg-danger";
            default:
                return "bg-danger";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0: // Giả sử 0 là trạng thái "Pending"
                return "Pending";
            case 1: // Giả sử 1 là trạng thái "Approved"
                return "Approved";
            case -1: // Giả sử -1 là trạng thái "Refuse"
                return "Refuse";
            default:
                return "Unknown";
        }
    };
    

    // kiểm tra role
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                setUserRole(userRole);

                if (userRole === "User" || userRole === "") {
                    setError(true);
                }
            } catch (error) {
                console.error("Error loading user role:", error);
            }
        };

        fetchUserRole();
    }, []);

    return (
        <>
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Offer List | Art Admin</title>
                    </Helmet>
                    {loading ? <Loading /> : ""}
                    <Layout>
                        <Breadcrumb title="Offer List" />
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header row">
                                        <div className="col-lg-4">
                                            <input type="text" className="form-control input-rounded" placeholder="Search code . . ." value={searchCode} onChange={handleSearchCodeChange} />
                                        </div>
                                        <div className="col-lg-4">
                                            <input type="date" className="form-control input-rounded" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-sm mb-0">
                                                <thead>
                                                    <tr>
                                                        <th class="align-middle">
                                                            <div class="form-check custom-checkbox">
                                                                <input type="checkbox" class="form-check-input" id="checkAll" />
                                                                <label class="form-check-label" for="checkAll"></label>
                                                            </div>
                                                        </th>
                                                        <th class="align-middle">Order</th>
                                                        <th class="align-middle">User</th>
                                                        {/* <th class="align-middle" style={{ minWidth: '12.5rem' }}>Ship To</th> */}
                                                        <th class="align-middle">Amount</th>
                                                        <th class="align-middle">Date</th>
                                                        <th class="align-middle">Status</th>
                                                        <th class="no-sort"></th>
                                                    </tr>
                                                </thead>
                                                <tbody id="orders">
                                                    {filteredCodes.map((item, index) => {
                                                        return (
                                                            <tr className="btn-reveal-trigger" key={index}>
                                                                <td className="py-2">
                                                                    <strong> {index + 1}</strong>
                                                                </td>
                                                                <td className="py-2">
                                                                    <Link to="">
                                                                        <strong>#{item.offerCode}</strong>
                                                                    </Link>
                                                                    <br />
                                                                    <Link to="">by {item.userName}</Link>
                                                                </td>
                                                                <td>{item.userName}</td>
                                                                <td className="py-2">${item.toTal}</td>
                                                                <td className="py-2">{format(new Date(item.createdAt), "yyyy-MM-dd HH:mm")}</td>
                                                                <td className= {`badge ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</td>
                                                                <td className="py-2 text-end">
                                                                    <Link to={`/offer-artist-detail/${item.offerCode}`} className="btn btn-primary shadow btn-xs sharp me-1">
                                                                        <i className="fa fa-eye"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="row">
                                            <div className="col-lg-5"></div>
                                            <div className="col-lg-4"></div>
                                            <div className="col-lg-3 text-end">
                                                <nav>
                                                    <ul className="pagination pagination-gutter pagination-primary no-bg">
                                                        <li className={`page-item page-indicator ${currentPage === 1 ? "disabled" : ""}`}>
                                                            <a className="page-link" href="javascript:void(0)" onClick={handlePrevPage}>
                                                                <i className="la la-angle-left"></i>
                                                            </a>
                                                        </li>
                                                        {Array.from({ length: totalPages }).map((_, index) => (
                                                            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                                                <a className="page-link" href="javascript:void(0)" onClick={() => handlePageChange(index + 1)}>
                                                                    {index + 1}
                                                                </a>
                                                            </li>
                                                        ))}
                                                        <li className={`page-item page-indicator ${currentPage === totalPages ? "disabled" : ""}`}>
                                                            <a className="page-link" href="javascript:void(0)" onClick={handleNextPage}>
                                                                <i className="la la-angle-right"></i>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Layout>
                </>
            )}
        </>
    );
}

export default ArtistOfferList;