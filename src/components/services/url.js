const url = {
    BASE_URL: "https://localhost:7270/api",
    MENU: {
        LIST: "/Menu",
    },

    DASHBOARD: {
        TOTAL_OFFER: "Dashboard/total-count-offer",
        TOTAL_USER: "Dashboard/total-count-user",
        TOTAL_ARTIST: "Dashboard/total-count-artist",
        TOTAL_ARTWORK: "Dashboard/total-count-artwork",
        TOTAL_OFFER_TODAY: "Dashboard/total-offer-today",
        TOTAL_REVENUE: "Dashboard/total-revenue",
        CHARTWEEKLY: "Dashboard/revenue/weekly",
        CHARTMONTHLY: "Dashboard/revenue/monthly/{}",
        CHARTYEARLY: "Dashboard/revenue/yearly",
        LIST_OFFER_TODAY: "Dashboard/list-offer-today",

        TOTAL_OFFER_ARTIST: "Dashboard/total-count-offer-artist",
        TOTAL_ARTWORK_ARTIST_SELL: "Dashboard/total-sold-artwork-artist",
        TOTAL_ARTWORK_ARTIST: "Dashboard/total-count-artwork-artist",
        TOTAL_OFFER_TODAY_ARTIST: "Dashboard/total-offer-today-artist",
        TOTAL_REVENUE_ARTIST: "Dashboard/total-revenue-artist",
        CHART_WEEKLY_ARTIST: "Dashboard/revenue/weekly/artist",
        CHART_MONTHLY_ARTIST: "Dashboard/revenue/monthly/artist/{}",
        CHART_YEARLY_ARTIST: "Dashboard/revenue/yearly/artist",
        LIST_OFFER_TODAY_ARTIST: "Dashboard/list-offer-today-artist",
    },

    ARTWORK: {
        CREATE: "/Artworks/createadmin",
        LIST: "/Artworks",
        DETAIL: "/Artworks/{}",
        UPDATE: "/Artworks/edit",
        // DELETE: "/Artworks/delete",
        LIST_ARTIST_ARTWORK: "Artworks/getall",
        CREATE_ARTIST_ARTWORK: "Artworks/create",
        DETAIL_ARTIST_ARTWORK: "Artworks/getbyid/{}",
        EDIT_ARTIST_ARTWORK: "Artworks/artistedit",
    },

    ARTIST: {
        LIST: "/Artists",
        DETAIL: "/Artists/{}",
        CREATE: "/Artists/create",
        UPDATE: "/Artists/edit",
        // DELETE: "/Artists/delete",
    },

    ART: {
        LIST: "/SchoolOfArts",
    },

    OFFER: {
        LIST: "/Offers/GetOrderAllAdmin",
        DETAIL: "/Offers/get-by-id-admin",  
        UPDATE: "Offers/update-status-Admin/{}",
        LIST_ARTIST_OFFER: "Offers/GetOfferAllArtist",
        DETAIL_ARTIST_OFFER: "/Offers/get-by-id-artist", 
    },

    REGISTER_ARTIST: {
        LIST: "/Admin/getall-request-artist",
        DETAIL: "/Admin/get-request-artist/{}", 
        UPDATE: "/Admin/accept-artist-request/{}",  
    },

    AUTH: {
        LOGIN: "/Auth/login",
        FORGOT_PASSWORD: "/Auth/forgot-password",
        PROFILE: "/Auth/profile",
        UPDATE_PROFILE: "/Auth/update-profile",
        CHANGE_PASSWORD: "/Auth/change-password",
        RESET_PASSWORD: "/Auth/reset-password",
        USER: "/Auth/user"
    },

};
export default url;