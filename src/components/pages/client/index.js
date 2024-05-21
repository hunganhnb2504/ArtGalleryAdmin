import Layout from "../../layouts/index";
import Breadcrumb from "../../layouts/breadcrumb";
import { Link, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "../../services/api";
import url from "../../services/url";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loading from "../../layouts/loading";
import NotFound from "../../pages/other/not-found";
function ClientList() {

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [clients, setClient] = useState([]);

    useEffect(() => {
        const loadFeedbacks = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.AUTH.USER);
                setClient(response.data);
            } catch (error) { }
        };
        loadFeedbacks();
    }, []);

    //paginate
    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 8;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const totalPages = Math.ceil(clients.length / clientsPerPage);
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentUser = clients.slice(indexOfFirstClient, indexOfLastClient);

    //search, filter
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
    };
    const handleSearchEmailChange = (e) => {
        setSearchEmail(e.target.value);
    };
    const handleSearchPhoneChange = (e) => {
        setSearchPhone(e.target.value);
    };
    const filteredUsers = currentUser.filter((item) => {
        const nameMatch = item.fullname.toLowerCase().includes(searchName.toLowerCase());
        const emailMatch = item.email.toLowerCase().includes(searchEmail.toLowerCase());
        const phoneMatch = item.phone.toLowerCase().includes(searchPhone.toLowerCase());
        return nameMatch && emailMatch && phoneMatch;
    });

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
                        <title>User List | Art Admin</title>
                    </Helmet>
                    {loading ? <Loading /> : ""}
                    <Layout>
                        <Breadcrumb title="Client List" />

                        <div className="row page-titles">
                            <div className="col-lg-4">
                                <input type="text" className="form-control input-rounded" placeholder="Search name . . ." value={searchName} onChange={handleSearchNameChange} />
                            </div>
                            <div className="col-lg-4">
                                <input type="text" className="form-control input-rounded" placeholder="Search email . . ." value={searchEmail} onChange={handleSearchEmailChange} />
                            </div>
                            <div className="col-lg-4">
                                <input type="text" className="form-control input-rounded" placeholder="Search phone . . ." value={searchPhone} onChange={handleSearchPhoneChange} />
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-sm mb-0 table-striped student-tbl">
                                    <thead>
                                        <tr>
                                            <th className="pe-3" style={{ maxWidth: '5px' }}>
                                                <div className="form-check custom-checkbox mx-2">
                                                    <input type="checkbox" className="form-check-input" id="checkAll" />
                                                    <label className="form-check-label" for="checkAll"></label>
                                                </div>
                                            </th>
                                            <th style={{ maxWidth: '30px' }}>No.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                            {/* <th></th> */}
                                        </tr>
                                    </thead>
                                    <tbody id="customers">
                                        {filteredUsers.map((item, index) => {
                                            return (
                                                <tr className="btn-reveal-trigger">
                                                    <td className="py-2">
                                                        <div className="form-check custom-checkbox mx-2">
                                                            <input type="checkbox" className="form-check-input" id="checkbox1" />
                                                            <label className="form-check-label" for="checkbox1"></label>
                                                        </div>
                                                    </td>
                                                    <td className="py-2">{index + 1}</td>
                                                    <td className="py-3">
                                                        <a href="#">
                                                            <div className="media d-flex align-items-center">
                                                                {/* <div className="avatar avatar-xl me-2">
                                                                    <div className=""><img className="rounded-circle img-fluid"
                                                                        src="images/avatar/5.png" width="30" alt="" />
                                                                    </div>
                                                                </div> */}
                                                                <div className="media-body">
                                                                    <h5 className="mb-0 fs--1">{item.fullname}</h5>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </td>
                                                    <td className="py-2">
                                                        <a href={`mailto:${item.email}`}>{item.email}</a>
                                                    </td>
                                                    <td className="py-2">
                                                        <a href={`tel:${item.phone}`}>{item.phone}</a>
                                                    </td>
                                                    <td className="py-2">
                                                        <a >{item.role}</a>
                                                    </td>
                                                    {/* <td className="py-2 ps-5">2392 Main Avenue, Penasauka</td> */}
                                                    <td className="py-2">{format(new Date(item.createdAt), "yyyy-MM-dd")}</td>
                                                    {/* <td>
                                                        <div className="d-flex">
                                                            <Link to={``} className="btn btn-primary shadow btn-xs sharp me-1">
                                                                <i className="fas fa-pencil-alt"></i>
                                                            </Link>
                                                        </div>
                                                    </td> */}
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
                    </Layout>
                </>
            )}
        </>
    );
}

export default ClientList;