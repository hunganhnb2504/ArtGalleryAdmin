import { Helmet } from "react-helmet";
import Layout from "../../layouts";
import Loading from "../../layouts/loading";
import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { Link, NavLink } from "react-router-dom";
import Chart from "react-apexcharts";
import { format } from "date-fns";
import NotFound from "../../pages/other/not-found";
function Dashboard() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

     //base biểu đồ doanh thu theo tuần
     const ChartRevenueWeekly = {
        options: {
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                },
            },
        },
        series: [
            {
                name: "Total proceeds",
                data: [],
            },
        ],
        xaxis: {
            categories: [],
        },
    };

    //base biểu đồ doanh thu theo tháng
    const ChartRevenueMonthly = {
        options: {
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                },
            },
        },
        series: [
            {
                name: "Total proceeds",
                data: [],
            },
        ],
        xaxis: {
            categories: [],
        },
    };

    //base biểu đồ doanh thu theo năm
    const ChartRevenueYearly = {
        options: {
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                },
            },
        },
        series: [
            {
                name: "Total proceeds",
                data: [],
            },
        ],
        xaxis: {
            categories: [],
        },
    };


    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [totalOffers, setTotalOffers] = useState([]);
    const [totalOfferToday, setTotalOfferToday] = useState([]);
    const [listOfferToday, setListOfferToday] = useState([]);
    const [totalArtists, setTotalArtists] = useState([]);
    const [totalUsers, setTotalUsers] = useState([]);
    const [totalArtWorks, setTotalArtWorks] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState([]);
    const [chartWeeklyOptions, setChartWeeklyOptions] = useState(ChartRevenueWeekly.options);
    const [chartWeeklySeries, setChartWeeklySeries] = useState(ChartRevenueWeekly.series);
    const [chartMonthlyOptions, setChartMonthlyOptions] = useState(ChartRevenueMonthly.options);
    const [chartMonthlySeries, setChartMonthlySeries] = useState(ChartRevenueMonthly.series);

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

    //chuyển đổi các tháng từ 1 thành Jan
    const getMonthName = (monthNumber) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[monthNumber - 1];
    };
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); //chọn năm của biểu đồ 12 tháng
    const [availableYears, setAvailableYears] = useState([]);
    const [chartYearlyOptions, setChartYearlyOptions] = useState(ChartRevenueYearly.options);
    const [chartYearlySeries, setChartYearlySeries] = useState(ChartRevenueYearly.series);

    //hiển thị total Offer
    useEffect(() => {
        const loadTotalOffers = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.TOTAL_OFFER);
                setTotalOffers(response.data);
            } catch (error) {}
        };
        loadTotalOffers();
    }, []);

    //hiển thị total offer today
    useEffect(() => {
        const loadTotalOfferToday = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.TOTAL_OFFER_TODAY);
                setTotalOfferToday(response.data);
            } catch (error) {}
        };
        loadTotalOfferToday();
    }, []);

    //hiển thị list offer today
    useEffect(() => {
        const loadListOfferToday = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.LIST_OFFER_TODAY);
                setListOfferToday(response.data);
            } catch (error) {}
        };
        loadListOfferToday();
    }, []);

    //hiển thị total Artist
    useEffect(() => {
        const loadTotalArtists = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.TOTAL_ARTIST);
                setTotalArtists(response.data);
            } catch (error) {}
        };
        loadTotalArtists();
    }, []);

    //hiển thị total Artwork
    useEffect(() => {
        const loadTotalArtworks = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.TOTAL_ARTWORK);
                setTotalArtWorks(response.data);
            } catch (error) {}
        };
        loadTotalArtworks();
    }, []);

    //hiển thị total User
    useEffect(() => {
        const loadTotalUsers = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.TOTAL_USER);
                setTotalUsers(response.data);
            } catch (error) {}
        };
        loadTotalUsers();
    }, []);

     //hiển thị total revenue
     useEffect(() => {
        const loadTotalRevenue = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.TOTAL_REVENUE);
                setTotalRevenue(response.data);
            } catch (error) {}
        };
        loadTotalRevenue();
    }, []);

    //biểu đồ doanh thu theo tuần
    const processDataForChartWeekly = (data) => {
        const categories = data.map((entry) => {
            const date = new Date(entry.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            return formattedDate;
        });
        const seriesData = data.map((entry) => entry.totalSales);
        return {
            categories,
            seriesData,
        };
    };
    useEffect(() => {
        const loadWeeklyRevenue = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.CHARTWEEKLY);
                const processedData = processDataForChartWeekly(response.data);

                setChartWeeklyOptions({
                    ...ChartRevenueWeekly.options,
                    xaxis: {
                        categories: processedData.categories,
                    },
                });

                setChartWeeklySeries([
                    {
                        name: "Total proceeds",
                        data: processedData.seriesData,
                    },
                ]);
            } catch (error) {}
        };
        loadWeeklyRevenue();
    }, []);


    //biểu đồ doanh thu theo 12 tháng của năm người dùng chọn
    const processDataForChartMonthly = (data) => {
        const categories = data.map((entry) => getMonthName(entry.month));
        const seriesData = data.map((entry) => entry.totalSales);
        return {
            categories,
            seriesData,
        };
    };
    useEffect(() => {
        const loadMonthlyRevenue = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.CHARTMONTHLY.replace("{}", selectedYear));
                const processedData = processDataForChartMonthly(response.data);

                setChartMonthlyOptions({
                    ...ChartRevenueMonthly.options,
                    xaxis: {
                        categories: processedData.categories,
                    },
                });

                setChartMonthlySeries([
                    {
                        name: "Total proceeds",
                        data: processedData.seriesData,
                    },
                ]);
            } catch (error) {
                console.error(error);
            }
        };
        loadMonthlyRevenue();
    }, [selectedYear]);
    useEffect(() => {
        const loadAvailableYears = () => {
            const currentYear = new Date().getFullYear();
            const availableYears = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);
            setAvailableYears(availableYears);
        };
        loadAvailableYears();
    }, []);

    //biểu đồ doanh thu theo năm
    const processDataForChartYearly = (data) => {
        const categories = data.map((entry) => entry.year);
        const seriesData = data.map((entry) => entry.totalSales);
        return {
            categories,
            seriesData,
        };
    };
    useEffect(() => {
        const loadYearlyRevenue = async () => {
            const userToken = localStorage.getItem("access_token");
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            try {
                const response = await api.get(url.DASHBOARD.CHARTYEARLY);
                const processedData = processDataForChartYearly(response.data);

                setChartYearlyOptions({
                    ...ChartRevenueYearly.options,
                    xaxis: {
                        categories: processedData.categories,
                    },
                });

                setChartYearlySeries([
                    {
                        name: "Total proceeds",
                        data: processedData.seriesData,
                    },
                ]);
            } catch (error) {
                console.error(error);
            }
        };
        loadYearlyRevenue();
    }, []);



    // kiểm tra role
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                setUserRole(userRole);

                if (userRole === "User" || userRole === "Movie Theater Manager Staff" || userRole === "Shopping Center Manager Staff") {
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
                        <title>Dashboard | Art Admin</title>
                    </Helmet>
                    {loading ? <Loading /> : ""}
                    <Layout>
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="row">
                                    <div className="col-xl-9 col-lg-9 col-md-9">
                                        <div className="card">
                                            <div className="card-body py-3 py-md-2 px-4">
                                                <div className="row">
                                                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                                        <div className="card mt-1 mt-md-3">
                                                            <div className="card-body p-3">
                                                                <div className="align-items-center h-100 d-flex flex-wrap">
                                                                    <div className="d-inline-block position-relative donut-chart-sale me-2">
                                                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path
                                                                                d="M9.34933 14.8577C5.38553 14.8577 2 15.47 2 17.9174C2 20.3666 5.364 21 9.34933 21C13.3131 21 16.6987 20.3877 16.6987 17.9404C16.6987 15.4911 13.3347 14.8577 9.34933 14.8577Z"
                                                                                fill="#FFFFFF"
                                                                            ></path>
                                                                            <path
                                                                                opacity="0.4"
                                                                                d="M9.34935 12.5248C12.049 12.5248 14.2124 10.4062 14.2124 7.76241C14.2124 5.11865 12.049 3 9.34935 3C6.65072 3 4.48633 5.11865 4.48633 7.76241C4.48633 10.4062 6.65072 12.5248 9.34935 12.5248Z"
                                                                                fill="#FFFFFF"
                                                                            ></path>
                                                                            <path
                                                                                opacity="0.4"
                                                                                d="M16.1734 7.84875C16.1734 9.19507 15.7605 10.4513 15.0364 11.4948C14.9611 11.6021 15.0276 11.7468 15.1587 11.7698C15.3407 11.7995 15.5276 11.8177 15.7184 11.8216C17.6167 11.8704 19.3202 10.6736 19.7908 8.87118C20.4885 6.19676 18.4415 3.79543 15.8339 3.79543C15.5511 3.79543 15.2801 3.82418 15.0159 3.87688C14.9797 3.88454 14.9405 3.90179 14.921 3.93246C14.8955 3.97174 14.9141 4.02253 14.9395 4.05607C15.7233 5.13216 16.1734 6.44207 16.1734 7.84875Z"
                                                                                fill="#FFFFFF"
                                                                            ></path>
                                                                            <path
                                                                                d="M21.7791 15.1693C21.4317 14.444 20.5932 13.9466 19.3172 13.7023C18.7155 13.5586 17.0853 13.3545 15.5697 13.3832C15.5472 13.3861 15.5344 13.4014 15.5325 13.411C15.5295 13.4263 15.5364 13.4493 15.5658 13.4656C16.2663 13.8048 18.9738 15.2805 18.6333 18.3928C18.6186 18.5289 18.7292 18.6439 18.8671 18.6247C19.5335 18.5318 21.2478 18.1705 21.7791 17.0475C22.0736 16.4534 22.0736 15.7635 21.7791 15.1693Z"
                                                                                fill="#FFFFFF"
                                                                            ></path>
                                                                        </svg>
                                                                    </div>
                                                                    <Link to={"/artist-list"}>
                                                                    <div className=" ">
                                                                        <h4 className="fs-18 font-w600 mb-1 text-break">Total Artist</h4>
                                                                        <span className="fs-14">{totalArtists}</span>
                                                                    </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                                        <div className="card mt-3">
                                                            <div className="card-body p-3">
                                                                <div className="align-items-center h-100 d-flex flex-wrap">
                                                                    <div className="d-inline-block position-relative donut-chart-sale me-2">
                                                                        <svg width="30" height="30" 
                                                                        viewBox="0 0 24 24" 
                                                                        fill="none" 
                                                                        xmlns="http://www.w3.org/2000/svg"> 
                                                                        <path d="M18.5116 10.0771C18.5116 10.8157 17.8869 11.4146 17.1163 11.4146C16.3457 11.4146 15.7209 10.8157 15.7209 10.0771C15.7209 9.33841 16.3457 8.7396 17.1163 8.7396C17.8869 8.7396 18.5116 9.33841 18.5116 10.0771Z" fill="#FFFFFF"></path> 
                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0363 5.53245C16.9766 5.39588 15.6225 5.39589 13.9129 5.39591H10.0871C8.37751 5.39589 7.02343 5.39588 5.9637 5.53245C4.87308 5.673 3.99033 5.96913 3.29418 6.63641C2.59803 7.30369 2.28908 8.14982 2.14245 9.19521C1.99997 10.211 1.99999 11.5089 2 13.1475V13.2482C1.99999 14.8868 1.99997 16.1847 2.14245 17.2005C2.28908 18.2459 2.59803 19.092 3.29418 19.7593C3.99033 20.4266 4.87307 20.7227 5.9637 20.8633C7.02344 20.9998 8.37751 20.9998 10.0871 20.9998H13.9129C15.6225 20.9998 16.9766 20.9998 18.0363 20.8633C19.1269 20.7227 20.0097 20.4266 20.7058 19.7593C21.402 19.092 21.7109 18.2459 21.8575 17.2005C22 16.1847 22 14.8868 22 13.2482V13.1476C22 11.5089 22 10.211 21.8575 9.19521C21.7109 8.14982 21.402 7.30369 20.7058 6.63641C20.0097 5.96913 19.1269 5.673 18.0363 5.53245ZM6.14963 6.858C5.21373 6.97861 4.67452 7.20479 4.28084 7.58215C3.88716 7.9595 3.65119 8.47635 3.52536 9.37343C3.42443 10.093 3.40184 10.9923 3.3968 12.1686L3.86764 11.7737C4.99175 10.8309 6.68596 10.885 7.74215 11.8974L11.7326 15.7223C12.1321 16.1053 12.7611 16.1575 13.2234 15.8461L13.5008 15.6593C14.8313 14.763 16.6314 14.8668 17.8402 15.9096L20.2479 17.9866C20.3463 17.7226 20.4206 17.4075 20.4746 17.0223C20.6032 16.106 20.6047 14.8981 20.6047 13.1979C20.6047 11.4976 20.6032 10.2897 20.4746 9.37343C20.3488 8.47635 20.1128 7.9595 19.7192 7.58215C19.3255 7.20479 18.7863 6.97861 17.8504 6.858C16.8944 6.7348 15.6343 6.73338 13.8605 6.73338H10.1395C8.36575 6.73338 7.10559 6.7348 6.14963 6.858Z" fill="#FFFFFF"></path>
                                                                         <path d="M17.0863 2.61039C16.2265 2.49997 15.1318 2.49998 13.7672 2.5H10.6775C9.31284 2.49998 8.21815 2.49997 7.35834 2.61039C6.46796 2.72473 5.72561 2.96835 5.13682 3.53075C4.79725 3.8551 4.56856 4.22833 4.41279 4.64928C4.91699 4.41928 5.48704 4.28374 6.12705 4.20084C7.21143 4.06037 8.597 4.06038 10.3463 4.06039H14.2612C16.0105 4.06038 17.396 4.06037 18.4804 4.20084C19.0394 4.27325 19.545 4.38581 20 4.56638C19.8454 4.17917 19.625 3.83365 19.3078 3.53075C18.719 2.96835 17.9767 2.72473 17.0863 2.61039Z" fill="#FFFFFF"></path> 
                                                                         </svg>
                                                                    </div>
                                                                    <Link to={"/artwork-list"}>
                                                                    <div className="">
                                                                        <h4 className="fs-18 font-w600 mb-1 text-break">Total ArtWork</h4>
                                                                        <span className="fs-14">{totalArtWorks}</span>
                                                                    </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                                        <div className="card mt-3">
                                                            <div className="card-body p-3">
                                                                <div className="align-items-center h-100 d-flex flex-wrap">
                                                                    <div className="d-inline-block position-relative donut-chart-sale me-2">
                                                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path
                                                                                d="M9.34933 14.8577C5.38553 14.8577 2 15.47 2 17.9174C2 20.3666 5.364 21 9.34933 21C13.3131 21 16.6987 20.3877 16.6987 17.9404C16.6987 15.4911 13.3347 14.8577 9.34933 14.8577Z"
                                                                                fill="#FFFFFF"
                                                                            ></path>
                                                                            <path
                                                                                opacity="0.4"
                                                                                d="M9.34935 12.5248C12.049 12.5248 14.2124 10.4062 14.2124 7.76241C14.2124 5.11865 12.049 3 9.34935 3C6.65072 3 4.48633 5.11865 4.48633 7.76241C4.48633 10.4062 6.65072 12.5248 9.34935 12.5248Z"
                                                                                fill="#FFFFFF"
                                                                            ></path>
                                                                            <path
                                                                                opacity="0.4"
                                                                                d="M16.1734 7.84875C16.1734 9.19507 15.7605 10.4513 15.0364 11.4948C14.9611 11.6021 15.0276 11.7468 15.1587 11.7698C15.3407 11.7995 15.5276 11.8177 15.7184 11.8216C17.6167 11.8704 19.3202 10.6736 19.7908 8.87118C20.4885 6.19676 18.4415 3.79543 15.8339 3.79543C15.5511 3.79543 15.2801 3.82418 15.0159 3.87688C14.9797 3.88454 14.9405 3.90179 14.921 3.93246C14.8955 3.97174 14.9141 4.02253 14.9395 4.05607C15.7233 5.13216 16.1734 6.44207 16.1734 7.84875Z"
                                                                                fill="#FFFFFF"
                                                                            ></path>
                                                                            <path
                                                                                d="M21.7791 15.1693C21.4317 14.444 20.5932 13.9466 19.3172 13.7023C18.7155 13.5586 17.0853 13.3545 15.5697 13.3832C15.5472 13.3861 15.5344 13.4014 15.5325 13.411C15.5295 13.4263 15.5364 13.4493 15.5658 13.4656C16.2663 13.8048 18.9738 15.2805 18.6333 18.3928C18.6186 18.5289 18.7292 18.6439 18.8671 18.6247C19.5335 18.5318 21.2478 18.1705 21.7791 17.0475C22.0736 16.4534 22.0736 15.7635 21.7791 15.1693Z"
                                                                                fill="#FFFFFF"
                                                                            ></path>
                                                                        </svg>
                                                                    </div>
                                                                    <div className=" ">
                                                                        <h4 className="fs-18 font-w600 mb-1 text-break">User/Artist</h4>
                                                                        <span className="fs-14">
                                                                            {totalUsers.totalUser}/{totalUsers.totalArtist}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                                        <div className="card mt-3">
                                                            <div className="card-body p-3">
                                                                <div className="align-items-center h-100 d-flex flex-wrap ">
                                                                    <div className="d-inline-block position-relative donut-chart-sale me-2">
                                                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart "><g><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></g></svg>
                                                                    </div>
                                                                    <div className=" ">
                                                                        <h4 className="fs-18 font-w600 mb-1 text-break">Total Order</h4>
                                                                        <span className="fs-14">
                                                                            {totalOffers}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-lg-3 col-md-3">
                                        <div className="card Expense overflow-hidden">
                                            <div className="card-body p-4 p-lg-3 p-xl-4 ">
                                                <div className="students1 one d-flex align-items-center justify-content-between ">
                                                    <div className="content">
                                                        <h2 className="mb-0">${totalRevenue.totalRevenue}</h2>
                                                        <span className="mb-2">Dollar</span>
                                                        <h5>Total revenue of the entire system!</h5>
                                                    </div>
                                                    <div>
                                                        <div className="d-inline-block position-relative donut-chart-sale mb-3">
                                                            <svg width="60" height="58" viewBox="0 0 60 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M39.0469 2.3125C38.3437 3.76563 38.9648 5.52344 40.418 6.22657C44.4609 8.17188 47.8828 11.1953 50.3203 14.9805C52.8164 18.8594 54.1406 23.3594 54.1406 28C54.1406 41.3125 43.3125 52.1406 30 52.1406C16.6875 52.1406 5.85937 41.3125 5.85937 28C5.85937 23.3594 7.18359 18.8594 9.66797 14.9688C12.0937 11.1836 15.5273 8.16016 19.5703 6.21485C21.0234 5.51173 21.6445 3.76563 20.9414 2.30079C20.2383 0.847664 18.4922 0.226569 17.0273 0.929694C12 3.34376 7.74609 7.09375 4.73437 11.8047C1.64062 16.6328 -1.56336e-06 22.2344 -1.31134e-06 28C-9.60967e-07 36.0156 3.11719 43.5508 8.78906 49.2109C14.4492 54.8828 21.9844 58 30 58C38.0156 58 45.5508 54.8828 51.2109 49.2109C56.8828 43.5391 60 36.0156 60 28C60 22.2344 58.3594 16.6328 55.2539 11.8047C52.2305 7.10547 47.9766 3.34375 42.9609 0.929693C41.4961 0.238287 39.75 0.84766 39.0469 2.3125V2.3125Z"
                                                                    fill="#53CAFD"
                                                                />
                                                                <path
                                                                    d="M41.4025 26.4414C41.9767 25.8671 42.258 25.1171 42.258 24.3671C42.258 23.6171 41.9767 22.8671 41.4025 22.2929L34.0314 14.9218C32.9533 13.8437 31.5236 13.2578 30.0119 13.2578C28.5002 13.2578 27.0587 13.8554 25.9923 14.9218L18.6212 22.2929C17.4728 23.4414 17.4728 25.2929 18.6212 26.4414C19.7697 27.5898 21.6212 27.5898 22.7697 26.4414L27.0939 22.1171L27.0939 38.7695C27.0939 40.3867 28.4064 41.6992 30.0236 41.6992C31.6408 41.6992 32.9533 40.3867 32.9533 38.7695L32.9533 22.1054L37.2775 26.4296C38.4025 27.5781 40.2541 27.5781 41.4025 26.4414Z"
                                                                    fill="#53CAFD"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-12">
                                <div className="row">
                                    <div className="col-xl-6 col-lg-6 col-md-6">
                                        <div className="card user-data-table">
                                            <div className="card-header pb-0 d-block d-sm-flex border-0">
                                                <div className="me-3">
                                                    <h4 className="card-title mb-2">Revenue chart</h4>
                                                    <span className="fs-12">Chart of Art Gallery revenue</span>
                                                </div>
                                                <div className="card-tabs mt-3 mt-sm-0">
                                                    <ul className="nav nav-tabs" role="tablist">
                                                        <li className="nav-item">
                                                            <a className="nav-link underline active" data-bs-toggle="tab" href="#weekly" role="tab">
                                                                Weekly
                                                            </a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link underline" data-bs-toggle="tab" href="#monthly" role="tab">
                                                                Monthly
                                                            </a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link underline" data-bs-toggle="tab" href="#yearly" role="tab">
                                                                Yearly
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="card-body tab-content p-0">
                                                <div className="tab-pane fade active show" id="weekly" role="tabpanel">
                                                    <div className="card-body custome-tooltip">
                                                        <div style={{ height: "100%", width: "100%" }}>
                                                        <Chart options={chartWeeklyOptions} series={chartWeeklySeries} type="area" />
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <span style={{ fontSize: "18px", fontWeight: "600", color: "white" }}>Revenue chart this week</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tab-pane fade " id="monthly" role="tabpanel">
                                                    <div className="card-body custome-tooltip">
                                                        <div style={{ height: "100%", width: "100%" }}>
                                                            <Chart options={chartMonthlyOptions} series={chartMonthlySeries} type="area" />
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <span
                                                                className="fc-icon fc-icon-chevron-left"
                                                                onClick={() => setSelectedYear(selectedYear - 1)}
                                                                disabled={selectedYear <= availableYears[0]}
                                                                style={{ fontSize: "30px", marginRight: "30px", cursor: "pointer", fontWeight: "600", color: "white" }}
                                                            ></span>
                                                            <span style={{ fontSize: "20px", fontWeight: "600", color: "white" }}>{selectedYear}</span>
                                                            <span
                                                            className="fc-icon fc-icon-chevron-right"
                                                            onClick={() => setSelectedYear(selectedYear + 1)}
                                                            disabled={selectedYear >= availableYears[availableYears.length - 1]}
                                                            style={{ fontSize: "30px", marginLeft: "30px", cursor: "pointer", fontWeight: "600", color: "white" }}
                                                            ></span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tab-pane fade " id="yearly" role="tabpanel">
                                                    <div className="card-body custome-tooltip">
                                                        <div style={{ height: "100%", width: "100%" }}>
                                                            <Chart options={chartYearlyOptions} series={chartYearlySeries} type="bar" />
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <span style={{ fontSize: "18px", fontWeight: "600", color: "white" }}>Revenue in the most recent 5 years</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6">
                                        <div className="card student-chart">
                                            <div className="card-header border-0 pb-0">
                                                <div className="me-3">
                                                    <h4 className="card-title mb-2">Performance chart</h4>
                                                    <span className="fs-12">Chart of revenue and number of order</span>
                                                </div>
                                            </div>
                                            <div className="card-body custome-tooltip">
                                                <div style={{ height: "100%", width: "100%" }}>
                                                    {/* <Chart options={chartShowOptions} series={chartShowSeries} type="area" /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-12">
                                        <div className="card mb-2">
                                            <div className="row gx-0">
                                                <div className="col-xl-7 col-sm-6">
                                                    <div className="card progressbar bg-transparent mb-0">
                                                        <div className="card-header border-0 pb-0">
                                                            <div>
                                                                <h4 className="fs-18 font-w600">Order overview</h4>
                                                                <span className="fs-14">Revenue needs to be achieved daily and monthly</span>
                                                            </div>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="progress default-progress">
                                                                <div
                                                                // className="progress-bar linear bg-vigit progress-animated"
                                                                // style={{ width: `${(orderOverview.dailyRevenue / 500).toFixed(2) * 100}%`, height: "8px" }}
                                                                // role="progressbar"
                                                                ></div>
                                                            </div>
                                                            <div className="d-flex align-items-end mt-2 pb-2 justify-content-between">
                                                                <span className="fs-16 font-w600 value">#Total proceeds today</span>
                                                                <span>
                                                                    {/* <span className="text-black pe-2"></span>${orderOverview.dailyRevenue} / $500 (Reached{" "}
                                                                    {((orderOverview.dailyRevenue / 500) * 100).toFixed(2)}% of today's revenue) */}
                                                                </span>
                                                            </div>

                                                            <div className="progress default-progress">
                                                                <div
                                                                // className="progress-bar linear bg-contact progress-animated"
                                                                // style={{ width: `${((orderOverview.monthlyRevenue / 15000) * 100).toFixed(2)}%`, height: "8px" }}
                                                                // role="progressbar"
                                                                ></div>
                                                            </div>
                                                            <div className="d-flex align-items-end mt-2 pb-2 justify-content-between">
                                                                <span className="fs-16 font-w600 value">#Total proceeds this month</span>
                                                                <span>
                                                                    {/* <span className="text-black pe-2"></span>${orderOverview.monthlyRevenue} / $15000 (Reached{" "}
                                                                    {((orderOverview.monthlyRevenue / 15000) * 100).toFixed(2)}% of this month's revenue) */}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-xl-5 col-sm-6">
                                                    <div className="card tags bg-transparent">
                                                        <div className="card-header border-0">
                                                            <div>
                                                                <h4 className="font-w600 fs-18">Others</h4>
                                                                <span>Some information about Offers</span>
                                                            </div>
                                                        </div>
                                                        <div className="card-body py-1">
                                                            <div className="row d-flex">
                                                                
                                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                    <span data-bs-toggle="modal" data-bs-target=".modal-order" style={{ cursor: "pointer" }}>
                                                                        <div className="card mt-1 mt-md-3">
                                                                            <div className="card-body p-3">
                                                                                <div className="align-items-center h-100 d-flex flex-wrap">
                                                                                    <div className=" ">
                                                                                        <h4 className="fs-18 font-w600 mb-1 text-break">
                                                                                            Offer Today: <span className="text-primary">{totalOfferToday.totalOfferToday}</span>
                                                                                        </h4>
                                                                                        <span className="fs-14">(Click to view)</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* modal list order today */}
                                    <div class="modal fade modal-order" tabindex="-1" role="dialog" aria-hidden="true">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">List Order Today</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <div className="table-responsive">
                                                        <table className="table table-sm mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th className="align-middle">
                                                                        <strong>Booking</strong>
                                                                    </th>
                                                                    <th className="align-middle pe-7">
                                                                        <strong>ArtWork</strong>
                                                                    </th>
                                                                    <th className="align-middle">
                                                                        <strong>Offer Price</strong>
                                                                    </th>
                                                                    <th className="align-middle">
                                                                        <strong>Status</strong>
                                                                    </th>
                                                                    <th className="align-middle">
                                                                        <strong>Offer Date</strong>
                                                                    </th>
                                                                    <th className="align-middle text-end">
                                                                        <strong>Actions</strong>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="orders">
                                                                {listOfferToday.map((item, index) => {
                                                                    return (
                                                                        <tr className="btn-reveal-trigger" key={index}>
                                                                            <td className="py-2">
                                                                                <Link to="">
                                                                                    <strong>#{item.offerCode}</strong>
                                                                                </Link>
                                                                                <br />
                                                                                <Link to="">by {item.userName}</Link>
                                                                            </td>
                                                                            <td className="py-2">{item.artWorkNames.length > 15 ? `${item.artWorkNames.slice(0, 15)}...` : item.artWorkNames}</td>
                                                                            <td className="py-2">${item.toTal}</td>
                                                                            <td className={`badge ${getStatusColor(item.status)} py-2`}>{getStatusText(item.status)}</td>
                                                                            <td className="py-2" >{format(new Date(item.createdAt), "yyyy-MM-dd HH:mm")}</td>
                                                                            <td className="py-2 text-end">
                                                                                <Link to={`/booking-detail/${item.offerCode}`} className="btn btn-primary shadow btn-xs sharp me-1">
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
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-danger light btn-sm" data-bs-dismiss="modal">
                                                        Close
                                                    </button>
                                                </div>
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

export default Dashboard;