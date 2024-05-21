import { Helmet } from "react-helmet";
import Layout from "../../../layouts";
import Breadcrumb from "../../../layouts/breadcrumb";
import Select from "react-select";
import { useEffect, useState } from "react";
import url from "../../../services/url";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../pages/other/not-found";

function  ArtistArtWorkCreate() {
    const [formArtWork, setFormArtWork] = useState({
        name: "",
        medium: "",
        artWorkImage: null,
        materials: "",
        size: "",
        condition: "",
        signature: "",
        rarity: "",
        certificateOfAuthenticity: "",
        frame: "",
        series: "",
        price: 0,
        schoolOfArtIds: [],
        artWorkImage_preview: null,
    });
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [nameExistsError, setNameExistsError] = useState("");
    const [schoolOfArt, setschoolOfArts] = useState([]);
    const [artist, setArtist] = useState([]);
    const navigate = useNavigate();

    //css background Select React
    const customStyle = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#566573",
        }),
        option: (provided, state) => ({
            ...provided,
            // backgroundColor: "#5336BC",
            color: "#333333",
        }),
    };

    const customStyles = {
        // Thêm các thuộc tính CSS tùy chỉnh tại đây

        color: 'black',
        // và các thuộc tính khác nếu cần
    };
    //hiển thị select school of art 
    useEffect(() => {
        const fetchSchoolOfArt = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.ART.LIST);
                const artData = response.data.map((schoolOfArt) => ({
                    value: schoolOfArt.id,
                    label: schoolOfArt.name,
                }));
                setschoolOfArts(artData);
            } catch (error) { }
        };
        fetchSchoolOfArt();
    }, []);

    //hiển thị select artist
    useEffect(() => {
        const fetchArtist = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.ARTIST.LIST);
                const artistData = response.data.map((artist) => ({
                    value: artist.id,
                    label: artist.name,
                }));
                setArtist(artistData);
            } catch (error) { }
        };
        fetchArtist();
    }, []);

    //validate
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (formArtWork.name === "") {
            newErrors.name = "Please enter name artwork";
            valid = false;
        } else if (formArtWork.name.length < 3) {
            newErrors.name = "Enter at least 3 characters";
            valid = false;
        } else if (formArtWork.name.length > 255) {
            newErrors.name = "Enter up to 255 characters";
            valid = false;
        }
        if (formArtWork.medium === "") {
            newErrors.medium = "Please enter medium";
            valid = false;
        }
        if (formArtWork.artWorkImage === null) {
            newErrors.artWorkImage = "Please choose photo";
            valid = false;
        }
        if (formArtWork.materials === "") {
            newErrors.materials = "Please enter materials";
            valid = false;
        }
        if (formArtWork.size === "") {
            newErrors.size = "Please enter size";
            valid = false;
        }
        if (formArtWork.condition === "") {
            newErrors.condition = "Please enter condition";
            valid = false;
        }
        if (formArtWork.signature === "") {
            newErrors.signature = "Please choose signature";
            valid = false;
        }
        if (formArtWork.rarity === "") {
            newErrors.rarity = "Please choose rarity";
            valid = false;
        }
        if (formArtWork.certificateOfAuthenticity === "") {
            newErrors.certificateOfAuthenticity = "Please choose Certificate";
            valid = false;
        }
        if (formArtWork.frame === "") {
            newErrors.frame = "Please choose Frame";
            valid = false;
        }
        if (formArtWork.series === "") {
            newErrors.series = "Please choose Series";
            valid = false;
        }
        if (formArtWork.price <= 0 || formArtWork.price == null) {
            newErrors.price = "Please enter Price";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    //xử lý tạo artwork
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm();

        if (isFormValid) {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.post(url.ARTWORK.CREATE_ARTIST_ARTWORK, formArtWork, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (response && response.data) {
                    // console.log(response.data);                  
                    Swal.fire({
                        text: "Create ArtWork Successffuly.",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Done",
                    });
                    setTimeout(() => {
                        navigate(`/artwork-artist-list`); //chuyển đến trang artwork-list
                    }, 3000);
                } else {
                }
            } catch (error) {
                if (error.response.status === 400 && error.response.data.message === "ArtWork already exists") {
                    setNameExistsError("The name of this ArtWork already exists");
                    Swal.fire({
                        text: "The name of this ArtWork already exists",
                        icon: "warning",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Done",
                    });
                } else {
                    Swal.fire({
                        text: "Unable to create ArtWork, please try again",
                        icon: "warning",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Done",
                    });

                }
                // console.error("Error creating test:", error);
                // console.error("Response data:", error.response.data);
            }
        }
    };

    //xử lý tải file ảnh
    const handleFileArtWorkChange = (e, fieldName) => {
        const { files } = e.target;
        const selectedImage = files.length > 0 ? URL.createObjectURL(files[0]) : null;

        setFormArtWork({
            ...formArtWork,
            [fieldName]: fieldName === "artWorkImage" ? (files.length > 0 ? files[0] : null) : null,
            artWorkImage_preview: selectedImage,
        });
    };
    const handleFileCoverChange = (e, fieldName) => {
        const { files } = e.target;
        const selectedImage = files.length > 0 ? URL.createObjectURL(files[0]) : null;

        setFormArtWork({
            ...formArtWork,
            [fieldName]: fieldName === "artWorkImage_preview" ? (files.length > 0 ? files[0] : null) : null,
            artWorkImage_preview: selectedImage,
        });
    };
    const handleChange = (e) => {
        const { name } = e.target;
        if (name === "artWorkImage") {
            handleFileArtWorkChange(e, name);
        } else if (name === "artWorkImage_preview") {
            handleFileCoverChange(e, name);
        } else {
            const { value } = e.target;
            setFormArtWork({ ...formArtWork, [name]: value });
        }
        setNameExistsError("");
    };

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
                        <title>ArtWork Create | Art Admin</title>
                    </Helmet>
                    <Layout>
                        <Breadcrumb title="ArtWork Create" />
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">ArtWork Create</h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            ArtWork Name <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" name="name" onChange={handleChange} className="form-control" placeholder="Please enter ArtWork name" autoFocus />
                                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                                        {nameExistsError && <div className="text-danger">{nameExistsError}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Medium</label>
                                                        <select
                                                            class="form-control"
                                                            id="medium"
                                                            name="medium"
                                                            styles={customStyles}
                                                            value={formArtWork.medium}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Medium</option>
                                                            <option value="OIL">Painting</option>
                                                            <option value="ACRYLIC">Works on Paper</option>
                                                            <option value="WATERCOLOR">Sculpture</option>
                                                            <option value="MIXED MEDIA">Mixed Media</option>
                                                            <option value="PHOTOGRAPHY">Photography</option>
                                                            <option value="CHARCOAL SKETCHES">Ceramics</option>
                                                            <option value="GRAPHIC ART">Graphic Art</option>
                                                        </select>
                                                        {errors.medium && <div className="text-danger">{errors.medium}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Materials <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" name="materials" onChange={handleChange} className="form-control" placeholder="Please enter Materials" />
                                                        {errors.materials && <div className="text-danger">{errors.materials}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Size <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" name="size" onChange={handleChange} className="form-control" placeholder="Please enter Size" />
                                                        {errors.size && <div className="text-danger">{errors.size}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Condition</label>
                                                        <select
                                                            class="form-control"
                                                            id="condition"
                                                            styles={customStyles}
                                                            name="condition"
                                                            value={formArtWork.condition}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Condition</option>
                                                            <option value="Excellent Condition">Excellent Condition</option>
                                                            <option value="Very Good Condition">Very Good Condition</option>
                                                            <option value="Good Condition">Good Condition</option>
                                                            <option value="Fair Condition">Fair Condition</option>
                                                        </select>
                                                        {errors.condition && <div className="text-danger">{errors.condition}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Signature</label>
                                                        <select
                                                            class="form-control"
                                                            id="signature"
                                                            styles={customStyles}
                                                            name="signature"
                                                            value={formArtWork.signature}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Signature</option>
                                                            <option value="Hand-signed by artist, Signature on back">Hand-signed by artist, Signature on back</option>
                                                            <option value="Hand-signed by artist, Signed in pencil">Hand-signed by artist, Signed in pencil</option>
                                                            <option value="On certificate of authenticity">On certificate of authenticity.</option>
                                                            <option value="Hand-signed by artist, Signed on the Front side">Hand-signed by artist, Signed on the Front side</option>
                                                        </select>
                                                        {errors.signature && <div className="text-danger">{errors.signature}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Rarity</label>
                                                        <select
                                                            class="form-control"
                                                            id="rarity"
                                                            styles={customStyles}
                                                            name="rarity"
                                                            value={formArtWork.rarity}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Rarity</option>
                                                            <option value="Unique">Unique</option>
                                                            <option value="Limited edition">Limited edition</option>
                                                            <option value="Open edition">Open edition</option>
                                                            <option value="Unknown edition">Unknown edition</option>
                                                        </select>
                                                        {errors.rarity && <div className="text-danger">{errors.rarity}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Certificate Of Authenticity</label>
                                                        <select
                                                            class="form-control"
                                                            styles={customStyles}
                                                            id="certificateOfAuthenticity"
                                                            name="certificateOfAuthenticity"
                                                            value={formArtWork.certificateOfAuthenticity}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Certificate</option>
                                                            <option value="Included (issued by gallery)">Included (issued by gallery)</option>
                                                            <option value="Included (issued by authorized authenticating body)">Included (issued by authorized authenticating body)</option>
                                                            <option value="Not Included">Not Included</option>
                                                        </select>
                                                        {errors.certificateOfAuthenticity && <div className="text-danger">{errors.certificateOfAuthenticity}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Frame</label>
                                                        <select
                                                            class="form-control"
                                                            id="frame"
                                                            name="frame"
                                                            styles={customStyles}
                                                            value={formArtWork.frame}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Frame</option>
                                                            <option value="Included">Included</option>
                                                            <option value="Not included">Not included</option>
                                                        </select>
                                                        {errors.frame && <div className="text-danger">{errors.frame}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            School of Art <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            name="schoolOfArtIds"
                                                            value={schoolOfArt.filter((option) => formArtWork.schoolOfArtIds.includes(option.value))}
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            styles={customStyle}
                                                            onChange={(selectedOption) => {
                                                                setFormArtWork({ ...formArtWork, schoolOfArtIds: selectedOption.map((option) => option.value) });
                                                            }}
                                                            options={schoolOfArt}
                                                            placeholder="Select School Of Art"
                                                        />
                                                        {errors.schoolOfArtIds && <div className="text-danger">{errors.schoolOfArtIds}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            ArtWork Series <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" name="series" onChange={handleChange} className="form-control" placeholder="Please enter series" autoFocus />
                                                        {errors.series && <div className="text-danger">{errors.series}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            ArtWork Price <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="number" name="price" onChange={handleChange} className="form-control" placeholder="Please enter price" autoFocus />
                                                        {errors.price && <div className="text-danger">{errors.price}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            ArtWork photos <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="file" name="artWorkImage" onChange={handleChange} className="form-control" accept=".jpg, .png, .etc" />
                                                        {errors.artWorkImage && <div className="text-danger">{errors.artWorkImage}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Preview ArtWork photos</label>
                                                        {formArtWork.artWorkImage_preview && (
                                                            <img src={formArtWork.artWorkImage_preview} alt="ArtWork Preview" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <button type="submit" className="btn btn-default">
                                                        Create ArtWork
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

export default ArtistArtWorkCreate;
