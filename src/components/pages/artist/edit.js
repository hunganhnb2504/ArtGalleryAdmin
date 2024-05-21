import { Helmet } from "react-helmet";
import Layout from "../../layouts";
import Breadcrumb from "../../layouts/breadcrumb";
import { useEffect, useState } from "react";
import url from "../../services/url";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../layouts/loading";
import NotFound from "../../pages/other/not-found";

function ArtistEdit() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [artistData, setArtistData] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    //validate
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (artistData.name === "") {
            newErrors.name = "Please enter name artist";
            valid = false;
        } else if (artistData.name.length < 3) {
            newErrors.name = "Enter at least 3 characters";
            valid = false;
        } else if (artistData.name.length > 255) {
            newErrors.name = "Enter up to 255 characters";
            valid = false;
        }
        if (artistData.imagePath === null) {
            newErrors.imagePath = "Please choose artist photo";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    //hien thi thong tin artist
    useEffect(() => {
        const userToken = localStorage.getItem("access_token");
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        api.get(`${url.ARTIST.DETAIL.replace("{}", id)}`)
            .then((response) => {
                setArtistData(response.data);
            })
            .catch((error) => {
                // console.error("Error fetching promotion details:", error);
            });
    }, [id]);

    //xử lý update artist
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm();

        if (isFormValid) {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.put(url.ARTIST.UPDATE, artistData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (response.status === 200) { 
                    // console.log(response.data);
                    Swal.fire({
                        text: "Update Artist Successffuly.",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Done",
                    });
                    setTimeout(() => {
                        navigate(`/artist-list`); //chuyển đến trang artist-list
                    }, 3000);
                } else {
                }
            } catch (error) {
                toast.error("Unable to update artist, please try again", {
                    // position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });

            }
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
                        <title>Artist Edit | Art Admin</title>
                    </Helmet>
                    {loading ? <Loading /> : ""}
                    <Layout>
                        <Breadcrumb title="Artist Edit" />
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Artist Edit</h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                        Artist Name <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={artistData.name}
                                                            onChange={(e) =>
                                                                setArtistData({
                                                                    ...artistData,
                                                                    name: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                            autoFocus
                                                        />
                                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Biography <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={artistData.biography}
                                                            onChange={(e) =>
                                                                setArtistData({
                                                                    ...artistData,
                                                                    biography: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Thumbnail <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file && /\.(jpg|png|jpeg)$/.test(file.name)) {
                                                                    // Update image preview state
                                                                    setImagePreview(URL.createObjectURL(file));

                                                                    // Tiếp tục xử lý
                                                                    setArtistData({
                                                                        ...artistData,
                                                                        imagePath: file,
                                                                    });
                                                                } else {
                                                                    console.error("Unsupported file format or no file selected");
                                                                }
                                                            }}
                                                            className="form-control"
                                                            accept=".jpg, .png, .jpeg"
                                                        />
                                                        {errors.imagePath && <div className="text-danger">{errors.imagePath}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Preview artist photos</label>
                                                        <img
                                                            id="imgPreview"
                                                            src={imagePreview || artistData.imagePath}
                                                            alt="Artist Preview"
                                                            style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                                            onError={(e) => console.error("Image Preview Error:", e)}
                                                        />{" "}
                                                    </div>
                                                </div>

                                                <div className="text-end">
                                                    <button type="submit" className="btn btn-default">
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
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

export default ArtistEdit;
