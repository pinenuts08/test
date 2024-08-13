new Vue({
    el: '#app',

    data() {
        return {
            newTodo: '',
            todoList: [],
            cnt: 0,
            selectedOption:'all',
            noTodoLeftMsg: '',
            isAllSelected: false
        }
    },

    computed: {
        selectAll: { // 카테고리별로 전체선택 분리하기
            get() {
                // 모든 목록이 체크됐을 때만 true 반환
                return this.filteredTodo.length > 0 && this.filteredTodo.every(todo => todo.selected)
            },

            set(value) { // 전체 선택 체크박스가 체크되면 setter가 호출됨
                this.filteredTodo.forEach(todo => { // 필터링된 todo list를 돌며 개별 객체(todo)의 selected 값을 setter가 전달한 value 값에 맞게 바꿈
                    todo.selected = value;
                });
                this.isAllSelected = value; // 전체 선택 체크박스 체크 유무도 value에 맞게 바꿈
            }
        },

        filteredTodo() { // 할 일 목록 필터링할 computed 요소
            let filteredTodoList = [];

            switch (this.selectedOption) {
                case 'done':
                    filteredTodoList = this.todoList.filter(todo => todo.isDone);
                    this.noTodoLeftMsg = "완료된 할 일이 없습니다.";
                    break;
                    
                case 'undone':
                    filteredTodoList = this.todoList.filter(todo => !todo.isDone);
                    this.noTodoLeftMsg = "미완료된 할 일이 없습니다.";
                    break
                    
                default:
                    filteredTodoList = this.todoList;
                    this.noTodoLeftMsg = "등록된 할 일이 없습니다.";
                    break;
            }

            return filteredTodoList;
        }

    },

    watch: {
        todoList: { //todoList에 변화가 생기면 작동
            deep: true,
            
            handler() { // newTodoList : 감시하고 있는 요소(여기선 todoList)의 변화 후 값
                // newTodoList의 모든 개별 객체의 selected 값이 true인지에 따라 isAllSelected 값 변경
                this.isAllSelected = this.filteredTodo.every(todo => todo.selected);
            }
        },

        selectedOption() { // selectedOption(필터링 옵션)에 변화가 생기면 호출
            this.isAllSelected = false;
            this.todoList.forEach(todo => { // 필터링된 리스트 안의 각 객체의 selected 옵션 false로 변경
                todo.selected = false;
            })
        }
    },

    methods: {
        loadTodos() { // 로컬 스토리지에 저장된 데이터를 불러오는 메서드
            let localStorageData = JSON.parse(localStorage.getItem("todos")); // 저장된 todoList 불러오기

            if (localStorageData!==null) {
                this.todoList = localStorageData;
            }

            let todoCnt = localStorage.getItem("cnt")===null? 0 : parseInt(localStorage.getItem("cnt"), 10); // id 값을 위한 count 불러오기
            console.log("getItem cnt : ",localStorage.getItem("cnt"));
            this.cnt = todoCnt; // cnt에 count 숫자 저장
        },
        
        addTodo() {
            if (this.newTodo.trim()) {

                this.cnt++ // count 하나 늘리기
                localStorage.setItem("cnt", this.cnt); // 새로운 count값 로컬 스토리지에 저장

                let currTodo = {text: this.newTodo, selected: false, id: this.cnt, isEditing: false, isDone: false};
                this.todoList.push(currTodo);
                this.newTodo = '';
                
                this.updateLocalStorage(); // 로컬 스토리지에 저장하는 updateLocalStorage()메서드 불러오기
            } else {
                alert("내용을 입력해주세요.");
            }
        },

        deleteTodo(id) {
            this.todoList = this.todoList.filter(todo=>todo.id !== id);
            this.updateLocalStorage(); 
        },
        
        deleteAllTodo() {
            switch (this.selectedOption) {
                case 'done':
                    this.todoList = this.todoList.filter(todo => !todo.isDone);
                    break;
                    
                case 'undone':
                    this.todoList = this.todoList.filter(todo => todo.isDone);
                    break;
                
                default:
                    this.todoList = [];
                    break;
            }
           // this.selectAll = false; // 전체 선택 체크박스 초기화
            this.isAllSelected = false;

            this.updateLocalStorage();
        },
        
        deleteSelectedTodo() {
            this.todoList = this.todoList.filter(todo => !todo.selected);
            if (this.filteredTodo.length===0) {
                this.selectAll = false;
                this.isAllSelected = false;
            }
            this.updateLocalStorage();
        },

        editTodo(id) {
            this.todoList.find(todo => todo.id === id).isEditing = true;
        },
        
        updateTodo(id) {
            if (!this.todoList.find(todo => todo.id === id).text) {
                alert("내용을 입력해주세요.");
                return;
            }
            this.todoList.find(todo => todo.id === id).isEditing = false;
            this.updateLocalStorage();
        },
        
        updateLocalStorage() {
            localStorage.setItem("todos", JSON.stringify(this.todoList));
        },

        toggleSelectAll() {
            this.selectAll = this.isAllSelected;
        },

        changeIsDone(id) { // 개별 todo의 완료 여부(isDone)를 바꾸는 메서드. 완료 버튼 클릭시 호출됨
            if (this.todoList.find(todo=>todo.id === id).isDone === false) { // 기존에 isDone 값이 false면
                this.todoList.find(todo=>todo.id === id).isDone = true; // true로 바꿈
            } else {
                this.todoList.find(todo=>todo.id === id).isDone = false;
            }
        }

    },

    // beforeCreate() {
    //     console.log('beforeCreate : 인스턴스 초기화 직후입니다. 아직 DOM에 접근이 불가합니다.');
    // },

    created() {
        console.log('created : 인스턴스가 생성돼 호출되었습니다. 아직 DOM에는 추가되지 않았습니다.');
        this.loadTodos(); // 페이지가 로드되면 자동으로 로컬 스토리지 데이터 불러오도록 메서드 호출
    },

    // beforeMount() {
    //     console.log('beforeMount : 템플릿 컴파일 후 첫 렌더링 전입니다. 요소들이 아직 DOM에 mounted되지 않았습니다.');
    //     // debugger;
    // },

    // mounted() {
    //     console.log('mounted : 인스턴스가 DOM에 마운트되었습니다. DOM에 접근이 가능합니다.');
    //     // debugger;
    // },

    // beforeUpdate() { 
    //     console.log('beforeUpdate : 데이터 변경 후 DOM에 패치되기 전입니다.');
    // },

    updated() { 
        console.log('updated : 데이터 변경으로 인해 가상 DOM이 다시 렌더링 및 패치되었습니다.');
        this.updateLocalStorage(); // 셀렉트 박스 체크시 업데이트를 위해 메서드 호출
    },

    // beforeDestroy() {
    //     console.log('beforeDestroy : 인스턴스가 제거되기 직전입니다. 이벤트 리스너 및 타이머를 정리합니다.');
    // },

    // destroyed() {
    //     console.log('destroyed : 모든 디렉티브 바인딩 해제, 인스턴스 및 모든 이벤트 리스너가 제거되었습니다.');
    // }

})