import { Helmet } from "react-helmet";
import Layout from "../../layouts";
import Breadcrumb from "../../layouts/breadcrumb";
import { useState } from "react";
import Select from "react-select";
import url from "../../services/url";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NotFound from "../../pages/other/not-found";
import Swal from "sweetalert2";
import { useEffect } from "react";

function ArtistCreate() {
    const [formArtist, setFormArtist] = useState({
        name: "",
        biography: "",
        description: "",
        imagePath: null,
        artworkIds: [],
        schoolOfArtIds: [],
    });
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [artworks, setArtWork] = useState([]);
    const [schoolOfArt, setSchoolOfArt] = useState([]);
    const navigate = useNavigate();

    const customStyles = {
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

    //hien thi select artwork
    useEffect(() => {
        const fetchArtWorks = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.ARTWORK.LIST);
                const artworkData = response.data.map((artwork) => ({
                    value: artwork.id,
                    label: artwork.name,
                }));
                setArtWork(artworkData);
            } catch (error) {}
        };
        fetchArtWorks();
    }, []);

    //hien thi select schoolOfArt
    useEffect(() => {
        const fetchSchoolOfArt = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.ART.LIST);
                const schoolOfArtData = response.data.map((schoolOfArt) => ({
                    value: schoolOfArt.id,
                    label: schoolOfArt.name,
                }));
                setSchoolOfArt(schoolOfArtData);
            } catch (error) {}
        };
        fetchSchoolOfArt();
    }, []);

    //validate
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (formArtist.name === "") {
            newErrors.name = "Please enter name artist";
            valid = false;
        } else if (formArtist.name.length < 3) {
            newErrors.name = "Enter at least 3 characters";
            valid = false;
        } else if (formArtist.name.length > 255) {
            newErrors.name = "Enter up to 255 characters";
            valid = false;
        }
        if (formArtist.imagePath === null) {
            newErrors.imagePath = "Please choose artist photo";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    //xử lý tạo Artist
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm();

        if (isFormValid) {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.post(url.ARTIST.CREATE, formArtist, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (response.status === 201) {
                    // console.log(response.data);                  
                    Swal.fire({
                        text: "Create Artist Successffuly.",
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
                toast.error("Unable to create artist, please try again", {
                    // position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                // console.error("Error creating test:", error);
                // console.error("Response data:", error.response.data);
            }
        }
    };

    //xử lý tải file ảnh
    const handleFileArtistChange = (e, fieldName) => {
        const { files } = e.target;
        const selectedImage = files.length > 0 ? URL.createObjectURL(files[0]) : null;

        setFormArtist({
            ...formArtist,
            [fieldName]: fieldName === "imagePath" ? (files.length > 0 ? files[0] : null) : null,
            image_preview: selectedImage,
        });
    };
    const handleChange = (e) => {
        const { name } = e.target;
        if (name === "imagePath") {
            handleFileArtistChange(e, name);
        } else {
            const { value } = e.target;
            setFormArtist({ ...formArtist, [name]: value });
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
                        <title>Artist Create | Art Admin</title>
                    </Helmet>
                    <Layout>
                        <Breadcrumb title="Artist Create" />
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Artist Create</h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Artist Name <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" name="name" onChange={handleChange} className="form-control" placeholder="Please enter name artist" autoFocus />
                                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Biography</label>
                                                        <input type="text" name="biography" onChange={handleChange} className="form-control" placeholder="Please enter Biography" />
                                                        {errors.biography && <div className="text-danger">{errors.biography}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Description</label>
                                                        <input type="text" name="description" onChange={handleChange} className="form-control" placeholder="Please enter Description" />
                                                        {errors.description && <div className="text-danger">{errors.description}</div>}
                                                    </div>
                                                </div>

                                                {/* <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">ArtWork</label>
                                                        <Select
                                                            name="artworkIds"
                                                            value={artworks.filter((option) => formArtist.artworkIds.includes(option.value))}
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            styles={customStyles}
                                                            onChange={(selectedOption) => {
                                                                setFormArtist({ ...formArtist, artworkIds: selectedOption.map((option) => option.value) });
                                                            }}
                                                            options={artworks}
                                                            placeholder="Select ArtWork"
                                                        />
                                                        
                                                    </div>
                                                </div> */}

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">School Of Art</label>
                                                        <Select
                                                            name="schoolOfArtIds"
                                                            value={schoolOfArt.filter((option) => formArtist.schoolOfArtIds.includes(option.value))}
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            styles={customStyles}
                                                            onChange={(selectedOption) => {
                                                                setFormArtist({ ...formArtist, schoolOfArtIds: selectedOption.map((option) => option.value) });
                                                            }}
                                                            options={schoolOfArt}
                                                            placeholder="Select School of Art"
                                                        />
                                                        {errors.biography && <div className="text-danger">{errors.biography}</div>}
                                                    </div>
                                                </div>
                                                
                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">
                                                            Image <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="file" name="imagePath" onChange={handleChange} className="form-control" accept=".jpg, .png, jpeg, .etc" />
                                                        {errors.imagePath && <div className="text-danger">{errors.imagePath}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-2">
                                                    <div className="mb-3">
                                                        <label className="text-label form-label">Preview artist photo</label>
                                                        {formArtist.image_preview && (
                                                            <img src={formArtist.image_preview} alt="Artist Preview" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-end">
                                                    <button type="submit" className="btn btn-default">
                                                        Create
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

export default ArtistCreate;
