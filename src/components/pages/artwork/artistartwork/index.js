import Layout from "../../../layouts/index";
import Breadcrumb from "../../../layouts/breadcrumb";
import { Link, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "../../../services/api";
import url from "../../../services/url";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loading from "../../../layouts/loading";
import NotFound from "../../other/not-found";

function ArtWorkArtistList() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [artworks, setArtWorks] = useState([]);
    const [isDeleteVisible, setDeleteVisible] = useState(false);
    const [tbodyCheckboxes, setTbodyCheckboxes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectAll, setSelectAll] = useState(false);

    //hiển thị danh sách artwork
    useEffect(() => {
        const loadArtWorks = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.ARTWORK.LIST_ARTIST_ARTWORK);
                // const filteredArtWorks = selectedDate
                //     ? response.data.filter((item) => 
                //     format(new Date(item.release_date), "yyyy-MM-dd") === format(new Date(selectedDate), "yyyy-MM-dd"))
                //     : response.data;
                setArtWorks(response.data);
                setTbodyCheckboxes(Array.from({ length: response.data.length }).fill(false));
            } catch (error) { }
        };
        loadArtWorks();
    }, []);

    //xử lý check tất cả và hiển thị thùng rác
    const handleSelectAll = () => {
        const updatedCheckboxes = !selectAll ? Array.from({ length: artworks.length }).fill(true) : Array.from({ length: artworks.length }).fill(false);
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

    //xử lý xoá artwork
    const handleDeleteArtWork = async () => {
        const selectedArtWorkIds = [];

        // lấy id của các artwork đã được chọn
        artworks.forEach((item, index) => {
            if (selectAll || tbodyCheckboxes[index]) {
                selectedArtWorkIds.push(item.id);
            }
        });

        const isConfirmed = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete selected ArtWorks?",
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
                const deleteResponse = await api.delete(url.ARTWORK.DELETE, {
                    data: selectedArtWorkIds,
                });
                if (deleteResponse.status === 200) {
                    setArtWorks((prevArtWorks) => prevArtWorks.filter((artwork) => !selectedArtWorkIds.includes(artwork.id)));
                    setTbodyCheckboxes((prevCheckboxes) => prevCheckboxes.filter((_, index) => !selectedArtWorkIds.includes(artworks[index].id)));
                    setDeleteVisible(false);
                    toast.success("Delete ArtWork Successfully.", {
                        // position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                    // console.log("data:", deleteResponse.data);
                } else {
                }
            } catch (error) {
                toast.error("Cannot Delete ArtWork!", {
                    // position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                console.error("Failed to delete ArtWork:", error);
            }
        }
    };

    //paginate
    const [currentPage, setCurrentPage] = useState(1);
    const artworksPerPage = 10;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const totalPages = Math.ceil(artworks.length / artworksPerPage);
    const indexOfLastArtWork = currentPage * artworksPerPage;
    const indexOfFirstArtWork = indexOfLastArtWork - artworksPerPage;
    const currentArtWorks = artworks.slice(indexOfFirstArtWork, indexOfLastArtWork);

    //search, filter
    const [searchName, setSearchName] = useState("");
    const [searchSchoolOfArt, setSearchSchoolOfArt] = useState("");
    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
    };
    const handleSearchSchoolOfArtChange = (e) => {
        setSearchSchoolOfArt(e.target.value);
    };
    const filteredArtWorks = currentArtWorks.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
        const schoolOfArtMatch = item.name.toLowerCase().includes(searchSchoolOfArt.toLowerCase());
        return nameMatch && schoolOfArtMatch;
    });

    // kiểm tra role
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                setUserRole(userRole);

                if (userRole === "User" || userRole === "Super Admin") {
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
                        <title>ArtWork List | Art Admin</title>
                    </Helmet>
                    {loading ? <Loading /> : ""}
                    <Layout>
                        <Breadcrumb title="ArtWork List" />

                        <div className="row page-titles">
                            <div className="col-lg-3">
                                <input type="text" className="form-control input-rounded" placeholder="Search title ArtWork . . ." value={searchName} onChange={handleSearchNameChange} />
                            </div>
                            <div className="col-lg-3">
                                <input type="text" className="form-control input-rounded" placeholder="Search School Of ArtWork . . ." value={searchSchoolOfArt} onChange={handleSearchSchoolOfArtChange} />
                            </div>
                            <div className="col-lg-3">
                                <NavLink onClick={handleDeleteArtWork}>
                                    <button type="button1" className={`btn btn-danger ${isDeleteVisible ? "" : "d-none"}`}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </NavLink>
                            </div>
                            <div className="col-lg-3">
                                <NavLink to="/artwork-artist-create">
                                    <button type="button1" className="btn btn-rounded btn-info">
                                        <span className="btn-icon-start text-info">
                                            <i className="fa fa-plus color-info"></i>
                                        </span>
                                        Create New ArtWork
                                    </button>
                                </NavLink>
                            </div>

                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <div className="text-end"></div>
                                <table className="table table-sm mb-0">
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
                                                <strong>ArtWork Name</strong>
                                            </th>
                                            <th>
                                                <strong>School Of Art</strong>
                                            </th>
                                            <th>
                                                <strong>Medium</strong>
                                            </th>
                                            <th>
                                                <strong>Material</strong>
                                            </th>
                                            <th>
                                                <strong>Price</strong>
                                            </th>
                                            <th>
                                                <strong>Action</strong>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="orders">
                                        {filteredArtWorks.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <div className="form-check custom-checkbox checkbox-primary">
                                                            <input type="checkbox" className="form-check-input" onChange={() => handleTbodyCheckboxChange(index)} checked={tbodyCheckboxes[index]} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <img src={item.artWorkImage} className="rounded-lg me-2 image-thumb" alt="" />
                                                    </td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <span className="w-space-no">{item.schoolOfArts[0].name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{item.medium}</td>
                                                    <td>{item.materials} </td>
                                                    <td>{item.price} ($)</td>

                                                    <td>
                                                        <div className="d-flex">
                                                            <Link to={`/artwork-artist-detail/${item.id}`} className="btn btn-success shadow btn-xs sharp me-1">
                                                                <i className="fa fa-eye"></i>
                                                            </Link>
                                                            <Link to={`/artwork-artist-edit/${item.id}`} className="btn btn-primary shadow btn-xs sharp me-1">
                                                                <i className="fas fa-pencil-alt"></i>
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

export default ArtWorkArtistList;
