const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const volIcon = $(".icon-toggle");
const volBar = $("#vol");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isMute: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Don't cry",
      singer: "Guns N' Roses",
      path: "./asset/music/dont-cry.mp3",
      image: "./asset/img/dont-cry.jpg",
    },
    {
      name: "Chiều lên bản thượng",
      singer: "Phi Nhung",
      path: "./asset/music/chieu-len-ban-thuong.mp3",
      image: "./asset/img/chieu-len-ban-thuong.jpg",
    },
    {
      name: "Đừng khóc nữa mà",
      singer: "Gia Huy",
      path: "./asset/music/dung-khoc-nua-ma.mp3",
      image: "./asset/img/dung-khoc-nua-ma.jpg",
    },
    {
      name: "Hoa vàng nay tan",
      singer: "Lil Z",
      path: "./asset/music/hoa-vang-nay-tan.mp3",
      image: "./asset/img/hoa-vang-nay-tan.jpg",
    },
    {
      name: "Khóc cho người ai khóc cho anh",
      singer: "Gia Huy",
      path: "./asset/music/khoc-cho-nguoi-ai-khoc-cho-anh.mp3",
      image: "./asset/img/khoc-cho-nguoi-ai-khoc-cho-anh.webp",
    },
    {
      name: "Nỗi đau ai ngờ",
      singer: "Minh Vương M4U",
      path: "./asset/music/noi-dau-ai-ngo.mp3",
      image: "./asset/img/noi-dau-ai-ngo.jpg",
    },
    {
      name: "Ngây thơ",
      singer: "Tăng Duy Tân",
      path: "./asset/music/ngay-tho.mp3",
      image: "./asset/img/ngay-tho.jpg",
    },
    {
      name: "Chẳng gì đẹp đẽ trên đời mãi",
      singer: "Khang Việt",
      path: "./asset/music/chang-gi-dep-de-tren-doi-mai.mp3",
      image: "./asset/img/chang-gi-dep-de-tren-doi-mai.jpg",
    },
    {
      name: "Em nên dừng lại",
      singer: "Khang Việt",
      path: "./asset/music/em-nen-dung-lai.mp3",
      image: "./asset/img/em-nen-dung-lai.jpg",
    },
    {
      name: "Dĩ vãng cuộc tình",
      singer: "Duy Mạnh",
      path: "./asset/music/di-vang-cuoc-tinh.mp3",
      image: "./asset/img/di-vang-cuoc-tinh.jpg",
    },
    {
      name: "Phải chia tay thôi",
      singer: "Tuấn Hưng",
      path: "./asset/music/phai-chia-tay-thoi.mp3",
      image: "./asset/img/phai-chia-tay-thoi.jpg",
    },
    {
      name: "Anne Marie 2002",
      singer: "Anne Marie",
      path: "./asset/music/anne-marie-2002.mp3",
      image: "./asset/img/anne-marie-2002.jpg",
    },
    {
      name: "Natural",
      singer: "Imagine Dragons",
      path: "./asset/music/natural.mp3",
      image: "./asset/img/natural.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div class="thumb" style="background-image: url('${
                  song.image
                }')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });

    playList.innerHTML = html.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    volBar.value = 100;

    // xử lý cd quay, dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10s
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xử lý phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      audio.volume = volBar.value / 100;
      cdThumbAnimate.play();
    };

    // khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // xử lý khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
    };

    // khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }

      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }

      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xử lý khi bật tắt random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // xử lý lặp lại 1 song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // xử lý khi click vào icon mute
    volIcon.onclick = function () {
      _this.isMute = !_this.isMute;
      volIcon.classList.toggle("vol-mute", _this.isMute);
    };

    volIcon.onmousedown = (e) => {
      if (_this.isMute) {
        audio.volume = volBar.value / 100;
      } else {
        audio.volume = 0;
        volBar.value = 0;
      }
    };

    volBar.onclick = function () {
      audio.volume = volBar.value / 100;
    };

    // lắng nghe click vào playlist
    playList.onclick = function (e) {
      // trả về element chính nó hoặc thành phần đầu tiên tính từ thành phần cha trở lên
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          // vì songNode.dataset.index là chuỗi
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // xử lý khi click vào song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      if ($(".song.active").offsetTop <= 203) {
        window.scrollTo({ top: 448 + "px", behavior: "smooth" });
      } else {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 300);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    /*
        Nếu biểu thức điều kiện đúng, 
        chương trình quay trở lại thực hiện khối công việc của vòng lặp do-while, 
        ngược lại, nếu biểu thức điều kiện sai, chương trình thoát khỏi vòng lặp do-while.
        */

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // gán cấu hình từ config vào app
    this.loadConfig();

    // định nghĩa các thuộc tính cho object
    this.defineProperties();

    // lắng nge các sự kiện(DOM Events)
    this.handleEvents();

    // tải thông tin bài hát hát đầu tiên vào UI(user interface) khi chạy ứng dụng
    this.loadCurrentSong();

    // render playlist
    this.render();

    // hiển thị trạng thái ban đầu của btn repeat và random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
