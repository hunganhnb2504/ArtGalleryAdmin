import { Helmet } from "react-helmet";
import Layout from "../../../layouts";
import Breadcrumb from "../../../layouts/breadcrumb";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import url from "../../../services/url";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../layouts/loading";
import NotFound from "../../../pages/other/not-found";

function ArtistArtWorkEdit() {
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
    const [artworkData, setArtWorkData] = useState({ schoolOfArts: [] });
    const [artworkImgePreview, setArtWorkImagePreview] = useState("");
    const [errors, setErrors] = useState({});
    const [nameExistsError, setNameExistsError] = useState("");
    const navigate = useNavigate();

    //validate
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (artworkData.name === "") {
            newErrors.name = "Please enter name artwork";
            valid = false;
        } else if (artworkData.name.length < 3) {
            newErrors.name = "Enter at least 3 characters";
            valid = false;
        } else if (artworkData.name.length > 255) {
            newErrors.name = "Enter up to 255 characters";
            valid = false;
        }
        if (artworkData.medium === "") {
            newErrors.medium = "Please enter medium";
            valid = false;
        }
        if (artworkData.artWorkImage === null) {
            newErrors.artWorkImage = "Please choose photo";
            valid = false;
        }
        if (artworkData.materials === "") {
            newErrors.materials = "Please enter materials";
            valid = false;
        }
        if (artworkData.size === "") {
            newErrors.size = "Please enter size";
            valid = false;
        }
        if (artworkData.condition === "") {
            newErrors.condition = "Please enter condition";
            valid = false;
        }
        if (artworkData.signature === "") {
            newErrors.signature = "Please choose signature";
            valid = false;
        }
        if (artworkData.rarity === "") {
            newErrors.rarity = "Please choose rarity";
            valid = false;
        }
        if (artworkData.certificateOfAuthenticity === "") {
            newErrors.certificateOfAuthenticity = "Please choose Certificate";
            valid = false;
        }
        if (artworkData.frame === "") {
            newErrors.frame = "Please choose Frame";
            valid = false;
        }
        if (artworkData.series === "") {
            newErrors.series = "Please choose Series";
            valid = false;
        }
        if (artworkData.price <= 0 || artworkData.price == null) {
            newErrors.price = "Please enter Price";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    //hien thi thong tin ArtWork
    useEffect(() => {
        const userToken = localStorage.getItem("access_token");
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        api.get(`${url.ARTWORK.DETAIL.replace("{}", id)}`)
            .then((response) => {
                setArtWorkData(response.data);
            })
            .catch((error) => {
                // console.error("Error fetching promotion details:", error);
            });
    }, [id]);

    //xử lý update ArtWork
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if (isFormValid) {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.put(url.ARTWORK.UPDATE, artworkData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (response && response.data) {
                    // console.log(response.data);
                    Swal.fire({
                        text: "Update ArtWork Successffuly.",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Done",
                    });
                    setTimeout(() => {
                        navigate(`/artwork-list`); //chuyển đến trang artwork-list
                    }, 3000);
                } else {
                }
            } catch (error) {
                if (error.response.status === 400 && error.response.data.message === "ArtWork already exists") {
                    setNameExistsError("The name of this ArtWork already exists");
                    toast.error("The name of this ArtWork already exists", {
                        // position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                    toast.error("Unable to update ArtWork, please try again", {
                        // position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                }
                console.error("Error creating test:", error);
                console.error("Response data:", error.response.data);
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

                if (userRole === "User" || userRole === "Shopping Center Manager Staff") {
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
                        <title>ArtWork Edit | Art Admin</title>
                    </Helmet>
                    {loading ? <Loading /> : ""}
                    <Layout>
                        <Breadcrumb title="ArtWork Edit" />
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">ArtWork Edit</h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            ArtWork Name <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={artworkData.name}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    name: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        />
                                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                                        {nameExistsError && <div className="text-danger">{nameExistsError}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Medium</label>
                                                        <select
                                                            class="form-control"
                                                            value={artworkData.medium}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    medium: e.target.value,
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select Medium</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                        </select>
                                                        {errors.medium && <div className="text-danger">{errors.medium}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Materials <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={artworkData.materials}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    materials: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        />
                                                        {errors.materials && <div className="text-danger">{errors.materials}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Size <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={artworkData.size}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    size: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        />
                                                        {errors.size && <div className="text-danger">{errors.size}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Condition <span className="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            value={artworkData.condition}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    condition: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        >
                                                            <option value="">Select Condition</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                        </select>
                                                        {errors.condition && <div className="text-danger">{errors.condition}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Signature( Chữ ký )<span className="text-danger">*</span>
                                                        </label>
                                                        <select

                                                            value={artworkData.signature}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    signature: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        >
                                                            <option value="">Select Signature</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                        </select>
                                                        {errors.signature && <div className="text-danger">{errors.signature}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Rarity<span className="text-danger">*</span>
                                                        </label>
                                                        <select

                                                            value={artworkData.rarity}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    rarity: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        >
                                                            <option value="">Select Rarity</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                        </select>
                                                        {errors.rarity && <div className="text-danger">{errors.rarity}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Certificate Of Authenticity<span className="text-danger">*</span>
                                                        </label>
                                                        <select

                                                            value={artworkData.certificateOfAuthenticity}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    certificateOfAuthenticity: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        >
                                                            <option value="">Select  Certificate Of Authenticity</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                        </select>
                                                        {errors.certificateOfAuthenticity && <div className="text-danger">{errors.certificateOfAuthenticity}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Frame<span className="text-danger">*</span>
                                                        </label>
                                                        <select

                                                            value={artworkData.frame}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    frame: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        >
                                                            <option value="">Select Frame</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                        </select>
                                                        {errors.frame && <div className="text-danger">{errors.frame}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            ArtWork Series <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            value={artworkData.series}
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    series: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        />
                                                        {errors.series && <div className="text-danger">{errors.series}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            ArtWorks photos <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file && /\.(jpg|png|jpeg)$/.test(file.name)) {
                                                                    // Update image preview state
                                                                    setArtWorkImagePreview(URL.createObjectURL(file));

                                                                    // Tiếp tục xử lý
                                                                    setArtWorkData({
                                                                        ...artworkData,
                                                                        artWorkImage: file,
                                                                    });
                                                                } else {
                                                                    console.error("Unsupported file format or no file selected");
                                                                }
                                                            }}
                                                            className="form-control"
                                                            accept=".jpg, .png, .jpeg"
                                                        />
                                                        {errors.artWorkImage && <div className="text-danger">{errors.artWorkImage}</div>}
                                                    </div>
                                                </div>

                                                

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            ArtWork Price <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            value={artworkData.price}                                        
                                                            onChange={(e) =>
                                                                setArtWorkData({
                                                                    ...artworkData,
                                                                    price: e.target.value,
                                                                })
                                                            }
                                                            className="form-control"
                                                        />
                                                        {errors.price && <div className="text-danger">{errors.price}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Preview ArtWorks photos</label>
                                                        <img
                                                            id="imgPreview"
                                                            src={artworkImgePreview || artworkData.artWorkImage}
                                                            alt="Product Preview"
                                                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                                            onError={(e) => console.error("Image Preview Error:", e)}
                                                        />{" "}
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <button type="submit" className="btn btn-default">
                                                        Update ArtWork
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

export default ArtistArtWorkEdit;
