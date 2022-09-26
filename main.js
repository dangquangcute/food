// Notes : 
/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause /seek
 * 4. CD rotate
 * 5. Next / Prev
 * 6. Random
 * 7. Next / Repeat when  ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when you click
 */
    const PLAYER_STORAGE_KEY = 'quangdang2003'
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document); 
    const player = $('.player');
    const cd = $('.cd');
    const heading = $('header h2');
    const thumb = $('.cd-thumb');
    const audio = $('#audio');
    const playBtn = $('.btn-toggle-play');
    const progress = $('.progress');
    const nextBtn = $('.btn-next');
    const prevBtn = $('.btn-prev');
    const randomBtn = $('.btn-random');
    const repeatBtn = $('.btn-repeat');
    const playList = $('.playlist');
    // console.log(repeatBtn);
 
    
    const app = {
        isPlaying:false,
        isRandom:false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        isRepeat:false,
        currentIndex: 0,
        setConfig:function(key,value){
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
        },
        songs:[
            {
                name: 'Seve x Outside',
                singer: 'HEST/ISZTD',
                path: './music/song7.mp3',
                image:'./image/song7.jpeg'
            },
            {
                name: 'End Of Time',
                singer: 'Alan walker',
                path: './music/song1.mp3',
                image:'./image/song1.jpeg'
            },
            {
                name: 'Dark Side',
                singer: 'Alan walker',
                path: './music/song2.mp3',
                image:'./image/song2.jpeg'
            },
            {
                name: 'Ignite',
                singer: 'Alan walker',
                path: './music/song3.mp3',
                image:'./image/song3.jpeg'
            },
            {
                name: 'Come Thru',
                singer: 'Jeremy Zucker',
                path: './music/song4.mp3',
                image:'./image/song4.jpeg'
            },
            {
                name: 'Summer Time',
                singer: 'K391',
                path: './music/song5.mp3',
                image:'./image/song5.jpeg'
            },
            {
                name: 'Lonely World',
                singer: 'Alan walker',
                path: './music/song6.mp3',
                image:'./image/song6.jpeg'
            },
            {
                name: 'Nevada',
                singer: 'Vicetone',
                path: './music/song8.mp3',
                image:'./image/song8.jpeg'
            },
            {
                name: 'Unstoppable',
                singer: 'Sia',
                path: './music/song9.mp3',
                image:'./image/song9.jpeg'
            },
            {
                name: 'Walk Thru Fire',
                singer: 'Vicetone',
                path: './music/song10.mp3',
                image:'./image/song10.jpeg    '
            },
        ],
        defineProperties: function(){
            Object.defineProperty(this,'currentSong',{
                get:function(){
                    return this.songs[this.currentIndex];
                }
            }
            )
        },
        render: function(){
            const htmls = this.songs.map((song,index) =>{
                return `
                <div>
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                        </div>
                    <div class="option">
                         <i class="fas fa-ellipsis-h"></i>
                    </div>
                 </div>
                </div>
                `;
            })
            playList.innerHTML = htmls.join('');
        },
        handleEvents:function(){
            const _this = this;
            const cdWidth = cd.offsetWidth;
            // xu li CD quay / du'ng(stop) => sd function tao keyframes animate co' 2 tham so ([1 array chua' kieu? animation],{1 option chua chu ky va cac thuoc tinh khac})
            
            const cdThumbsAnimate = thumb.animate([
                {transform: 'rotate(360deg)'}
            ],{
                duration: 10000,
                iterations: Infinity, // vong lap
            })
            cdThumbsAnimate.pause();
            // xu li khi cuon chuot
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newWidth = cdWidth - scrollTop;
                cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
                cd.style.opacity = newWidth / cdWidth;              // lay newWidth va cdWidth vi neu thay cdwidth = scrollTop thi kich thuoc bi nghich nhieu' va bi giam? nhanh
            }
            // xu li khi click play 
            playBtn.onclick = function(){
                if(_this.isPlaying){
                    audio.pause();
                } else{
                    audio.play();
                }  
            }
            //khi song duoc play 
            audio.onplay = function(){
                _this.isPlaying= true;
                player.classList.add('playing'); 
                cdThumbsAnimate.play();
            }
            //khi song bi pause
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbsAnimate.pause();
            }
            //khi song bat dau thay doi
            audio.ontimeupdate = function(){
              if(audio.duration){
                const progressPercents = Math.floor(audio.currentTime / audio.duration * 100);
                // phai thuc * 100 trc khi gan' cho value cua seek
                 progress.value = progressPercents  
              }              
            }
            //  xu li tua song
            progress.onchange = function(e){
                const seekTime = (e.target.value / 100) * audio.duration;
                audio.currentTime = seekTime;
            }
            //xu li khi next song
            nextBtn.onclick = function(){
                if(_this.isRandom)
                {
                    _this.playRandomSong();
                }else{
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            // xu li khi lui' bai'
            prevBtn.onclick = function(){
                if(_this.isRandom)
                {
                    _this.playRandomSong();
                }else{
                _this.prevSong();
                 }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            // xu li khi bat / tat random
            randomBtn.onclick = function(){
               _this.isRandom = !_this.isRandom;
               _this.setConfig('isRandom', _this.isRandom);
               randomBtn.classList.toggle('active',_this.isRandom);
            }
            // xu li khi repeat song 
            repeatBtn.onclick = function(){
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat',_this.isRepeat);
                repeatBtn.classList.toggle('active',_this.isRepeat);
            }
            //xu li khi ket thuc bai hat 
            audio.onended = function(){
                //su dung dom evnets ended
                if(_this.isRepeat){
                    audio.play();
                }else{
                    nextBtn.click();
                }
            }
            //lang nghe viec click vao bai hat
            // xu li khi la song
            playList.onclick = function(e){
                const songNode = e.target.closest('.song:not(.active)');
                const optionNode = e.target.closest('.option');
                if(songNode || optionNode)
                {
                   if(songNode){
                   _this.currentIndex = Number(songNode.dataset.index) // do dat data index o song nen k the click o bat ki dau dc
                   // , c2 sd dataset.index, Convert sang number do khi get ra index la string
                   _this.loadCurrentSong();
                   _this.render();
                   audio.play();
                   }
                   if(optionNode){} // HomeWork

                }
            }
        },
        scrollToActiveSong: function(){
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            })
        },
        loadConfig: function(){
            this.isRandom = this.config.isRandom;
            this.isRepeat = this.config.isRepeat;
        },
        loadCurrentSong: function(){
            heading.innerText = this.currentSong.name;
            thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path;
        },
        nextSong: function(){
            this.currentIndex++;
            if(this.currentIndex >= this.songs.length)
            {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        },
        prevSong: function(){
            this.currentIndex--;
            if(this.currentIndex < 0)
            {
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong();
        },
        playRandomSong: function(){
            let newIndex;
            do { 
                newIndex = Math.floor(Math.random() * this.songs.length);
            }while(this.currentIndex === newIndex);
            this.currentIndex = newIndex;
            this.loadCurrentSong();
        },
        loadFeatureInterface: function(){
            repeatBtn.classList.toggle('active',this.isRepeat);
            randomBtn.classList.toggle('active',this.isRandom);
        },
        start: function(){
            //loadConfig ra interface
            this.loadConfig();
            //defined property
            this.defineProperties();
            //listen / handle events
            this.handleEvents();
            //render playlists
            this.render();
            this.loadCurrentSong();
            this.loadFeatureInterface();
        }
    }
    app.start();