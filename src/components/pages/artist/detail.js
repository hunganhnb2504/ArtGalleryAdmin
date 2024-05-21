import Layout from "../../layouts/index";
import Breadcrumb from "../../layouts/breadcrumb";
import { Link, NavLink, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "../../services/api";
import url from "../../services/url";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loading from "../../layouts/loading";
import NotFound from "../../pages/other/not-found";

function ArtistDetail() {
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [ArtistDetail, setArtistDetail] = useState({ artWork: [] });

    //hiển thị chi tiết artist
    useEffect(() => {
        const loadArtist = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(`${url.ARTIST.DETAIL.replace("{}", id)}`)
                setArtistDetail(response.data);
            } catch (error) { }
        };
        loadArtist();
    }, []);

    // paginate
    const [currentPage, setCurrentPage] = useState(1);
    const gallerysPerPage = 6;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    // const totalPages =  Math.ceil(ArtistDetail.artWork.length / gallerysPerPage);
    // const indexOfLastGallery = currentPage * gallerysPerPage;
    // const indexOfFirstGallery = indexOfLastGallery - gallerysPerPage;
    // const currentGallerys = ArtistDetail.slice(indexOfFirstGallery, indexOfLastGallery);

    const totalPages = Math.ceil(ArtistDetail.artWork.length / gallerysPerPage);
    const startIndex = (currentPage - 1) * gallerysPerPage;
    const selectedImages = ArtistDetail.artWork.slice(startIndex, startIndex + gallerysPerPage);

    // kiểm tra role
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                setUserRole(userRole);

                if (userRole === "User" || userRole === "Movie Theater Manager Staff") {
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
                        <title>Artist Detail | R Admin</title>
                    </Helmet>
                    {loading ? <Loading /> : ""}
                    <Layout>
                        <Breadcrumb title="Artist Detail" />

                        <div className="col-xl">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row" style={{ marginTop: "20px" }}>
                                        <div className="col-xl-12">
                                            <h4 className="d-inline">Artist Details</h4>
                                            <table className="table mt-4 mb-4">
                                                <tbody>
                                                    <tr>
                                                        <th scope="col">Artist Name</th>
                                                        <th scope="col">Image</th>
                                                        {/* <th scope="col">Biography</th> */}
                                                        <th scope="col">Description</th>
                                                        <th scope="col">Number Of Follow</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{ArtistDetail.name}</td>
                                                        <td className="name-artist"><img style={{ height: "100px", objectFit: "cover" }} src={ArtistDetail.image}></img></td>
                                                        {/* <td>{ArtistDetail.biography}</td> */}
                                                        <td>{ArtistDetail.description}</td>
                                                        <td>{ArtistDetail.favoriteCount}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {/* <h4 className="d-inline">ArtWork Image </h4>
                                            <div className="post-details">
                                                <img src={ArtistDetail.artWork.artWorkImage} alt="image image" style={{ height: "250px", objectFit: "cover" }} className="img-fluid mt-4 mb-4 w-100" />
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row" style={{ marginTop: "20px" }}>
                                        <div className="col-xl-12">
                                            <h4 className="d-inline">ArtWork Image </h4>
                                            <div className="post-details">
                                                <div className="row">
                                                    {selectedImages.length > 0 ? (
                                                        selectedImages.map((image, index) => (
                                                            <div className="col-md-4 mb-4" key={index}>
                                                                <Link to={`/artwork-detail/${image.artWorkId}`}>
                                                                    <img src={image.artWorkImage} alt={`ArtWork Image ${index + 1}`} className="img-fluid art-work-image" />
                                                                </Link>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>Loading images...</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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


                        <div className="col-xl">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row" style={{ marginTop: "20px" }}>
                                        <div className="col-xl-12">
                                            <h4 className="d-inline">ArtWork Sold</h4>
                                            <table className="table mt-4 mb-4">
                                                <tbody>
                                                    <tr>
                                                        <th scope="col">Artist Name</th>
                                                        <th scope="col">Image</th>
                                                        <th scope="col">Amount</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{ArtistDetail.name}</td>
                                                        <td className="name-artist"><img style={{ height: "100px", objectFit: "cover" }} src={ArtistDetail.image}></img></td>
                                                        <td>{ArtistDetail.toTal}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
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

export default ArtistDetail;