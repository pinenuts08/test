new Vue({
    el:'#app',

    data() {
        return {
            movieNM: '',
            userInfo: [],

        }
    },

    computed: {

    },

    methods: {
        searchWithMovieNm(movieNM) {

        },

        addUser() {
            let newUser = {nickName:'', recentPlayedCharacter:[], kda:0, currentRP:0, maxRP:0, tier:'', id:''};
            userInfo.push(newUser);
        }
    },

})