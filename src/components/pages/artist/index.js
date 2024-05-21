import Layout from "../../layouts/index";
import Breadcrumb from "../../layouts/breadcrumb";
import { Link, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "../../services/api";
import url from "../../services/url";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../layouts/loading";
import NotFound from "../other/not-found";

function ArtistsList() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [artists, setArtists] = useState([]);
    const [isDeleteVisible, setDeleteVisible] = useState(false);
    const [tbodyCheckboxes, setTbodyCheckboxes] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    //xử lý check tất cả và hiển thị thùng rác
    const handleSelectAll = () => {
        const updatedCheckboxes = !selectAll ? Array.from({ length: artists.length }).fill(true) : Array.from({ length: artists.length }).fill(false);
        setTbodyCheckboxes(updatedCheckboxes);
        setSelectAll(!selectAll);
        const checkboxes = document.querySelectorAll('#orders input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = !selectAll;
        });
        setDeleteVisible(!selectAll);
    };
    const handleCheckboxChange = () => {
        const checkboxes = document.querySelectorAll('#orders input[type="checkbox"]');
        const selectedCheckboxes = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
        setDeleteVisible(selectedCheckboxes.length > 0);
    };
    const handleTbodyCheckboxChange = (index) => {
        const updatedTbodyCheckboxes = [...tbodyCheckboxes];
        updatedTbodyCheckboxes[index] = !updatedTbodyCheckboxes[index];
        setTbodyCheckboxes(updatedTbodyCheckboxes);
        const isDeleteVisible = selectAll || updatedTbodyCheckboxes.some((checkbox) => checkbox);
        setDeleteVisible(isDeleteVisible);
    };

    //hiển thị danh sách artists
    useEffect(() => {
        const loadArtists = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.ARTIST.LIST);
                setArtists(response.data);
                setTbodyCheckboxes(Array.from({ length: response.data.length }).fill(false));
            } catch (error) { }
        };
        loadArtists();
    }, []);

    // //xử lý xoá artists
    const handleDeleteArtist = async () => {
        const selectedArtistIds = [];

        // lấy id của các food đã được chọn
        artists.forEach((item, index) => {
            if (selectAll || tbodyCheckboxes[index]) {
                selectedArtistIds.push(item.id);
            }
        });

        const isConfirmed = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete selected Artist?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "I'm sure",
        });
        if (isConfirmed.isConfirmed) {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const deleteResponse = await api.delete(url.ARTIST.DELETE, {
                    data: selectedArtistIds,
                });
                if (deleteResponse.status === 200) {
                    setArtists((prevArtists) => prevArtists.filter((artist) => !selectedArtistIds.includes(artist.id)));
                    setTbodyCheckboxes((prevCheckboxes) => prevCheckboxes.filter((_, index) => !selectedArtistIds.includes(artists[index].id)));
                    setDeleteVisible(false);
                    Swal.fire({
                        text: "Success delete Artist",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Done",
                    });
                } else {
                }
            } catch (error) {
                Swal.fire({
                    text: "Unable to  delete Artist",
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Done",
                });
                console.error("Failed to delete Artist:", error);
            }
        }
    };

    //paginate
    const [currentPage, setCurrentPage] = useState(1);
    const artistsPerPage = 4;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const totalPages = Math.ceil(artists.length / artistsPerPage);
    const indexOfLastArtist = currentPage * artistsPerPage;
    const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
    const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);

    //search, filter
    const [searchName, setSearchName] = useState("");
    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
    };
    const filteredArtists = currentArtists.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
        return nameMatch;
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
                        <title>Artists List | Art Admin</title>
                    </Helmet>
                    {loading ? <Loading /> : ""}
                    <Layout>
                        <Breadcrumb title="Artists List" />

                        <div className="row page-titles">
                            <div className="col-lg-5">
                                <input type="text" className="form-control input-rounded" placeholder="Search name artist . . ." value={searchName} onChange={handleSearchNameChange} />
                            </div>
                            <div className="col-lg-1 text-end">
                                <NavLink onClick={handleDeleteArtist}>
                                    <button type="button" className={`btn btn-danger ${isDeleteVisible ? "" : "d-none"}`}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </NavLink>
                            </div>
                            <div className="col-lg-3 text-center">
                                {/* <NavLink to="/artist-delete-at">
                                    <button type="button" className="btn btn-rounded btn-warning">
                                        <span className="btn-icon-start text-warning">
                                            <i className="fa fa-trash"></i>
                                        </span>
                                        Deleted List
                                    </button>
                                </NavLink> */}
                            </div>
                            <div className="col-lg-3">
                                <NavLink to="/artist-create">
                                    <button type="button" className="btn btn-rounded btn-info">
                                        <span className="btn-icon-start text-info">
                                            <i className="fa fa-plus color-info"></i>
                                        </span>
                                        Create New Artist
                                    </button>
                                </NavLink>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-responsive-md">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="form-check custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        onChange={() => {
                                                            handleSelectAll();
                                                            handleCheckboxChange();
                                                        }}
                                                        checked={selectAll}
                                                    />
                                                </div>
                                            </th>
                                            <th>
                                                <strong>Image</strong>
                                            </th>
                                            <th>
                                                <strong>Artist Name</strong>
                                            </th>
                                            <th>
                                                <strong>Biography</strong>
                                            </th>
                                            <th>
                                                <strong>Action</strong>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="orders">
                                        {filteredArtists.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <div className="form-check custom-checkbox checkbox-primary">
                                                            <input type="checkbox" className="form-check-input" onChange={() => handleTbodyCheckboxChange(index)} checked={tbodyCheckboxes[index]} />
                                                        </div>{" "}
                                                    </td>
                                                    <td>
                                                        <img src={item.image} className="rounded-lg me-2 image-thumb" alt="" />
                                                    </td>

                                                    <td>{item.name}</td>

                                                    <td>{item.biography}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Link to={`/artist-edit/${item.id}`} className="btn btn-primary shadow btn-xs sharp me-1">
                                                                <i className="fas fa-pencil-alt"></i>
                                                            </Link>
                                                            <Link to={`/artist-detail/${item.id}`} className="btn btn-primary shadow btn-xs sharp me-1">
                                                                <i className="fa fa-eye"></i>
                                                            </Link>
                                                        </div>
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
                    </Layout>
                </>
            )}
        </>
    );
}

export default ArtistsList;
