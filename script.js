document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Hamburger Menu Functionality
    // ======================
    const hamburgerBtn = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');
    const body = document.body;

    // Fungsi toggle menu
    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
            body.style.position = 'fixed';
        } else {
            body.style.overflow = '';
            body.style.position = '';
        }
    }

    // Event listeners
    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Tutup menu saat klik link navigasi
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Tutup menu saat klik di luar
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && 
            navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // ======================
    // Animate Skill Progress Bars
    // ======================
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    function animateProgressBars() {
        skillProgressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.setProperty('--progress-width', width);
        });
    }

    // Jalankan animasi saat halaman dimuat
    setTimeout(animateProgressBars, 500);

    // ======================
    // Download PDF Functionality
    // ======================
    const downloadBtn = document.querySelector('.button');
    
    downloadBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Menyiapkan PDF...';
        downloadBtn.disabled = true;
        
        try {
            // Load libraries dynamically if not already loaded
            if (!window.jspdf || !window.html2canvas) {
                await Promise.all([
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
                ]);
            }

            const { jsPDF } = window.jspdf;
            
            // Sembunyikan elemen yang tidak perlu di PDF
            const elementsToHide = document.querySelectorAll('.hamburger, nav ul');
            elementsToHide.forEach(el => el.style.visibility = 'hidden');
            
            // Capture seluruh halaman
            const element = document.body;
            const options = {
                scale: 1,
                useCORS: true,
                scrollY: 0,
                windowHeight: element.scrollHeight,
                logging: true
            };
            
            const canvas = await html2canvas(element, options);
            const imgData = canvas.toDataURL('image/png');
            
            // Buat PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Portfolio_Dionisio.pdf');
            
        } catch (error) {
            console.error('Gagal download:', error);
            downloadBtn.textContent = 'Error! Coba Lagi';
        } finally {
            // Kembalikan visibility elemen
            const elementsToHide = document.querySelectorAll('.hamburger, nav ul');
            elementsToHide.forEach(el => el.style.visibility = '');
            
            setTimeout(() => {
                downloadBtn.textContent = originalText;
                downloadBtn.disabled = false;
            }, 2000);
        }
    });
    
    // Helper function untuk load script dinamis
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) return resolve();
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    // ======================
    // Smooth Scrolling untuk Anchor Links
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.hash !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// ======================
// Form Validation with jQuery
// ======================
$(document).ready(function() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Reset error messages
        $('.error-message').removeClass('active');

        // Validasi Nama
        const nama = $('#nama').val().trim();
        if (nama === '') {
            showError($('#nama'), 'Nama lengkap wajib diisi');
            isValid = false;
        } else if (nama.length > 50) {
            showError($('#nama'), 'Nama maksimal 50 karakter');
            isValid = false;
        }

        // Validasi Email
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError($('#email'), 'Email wajib diisi');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError($('#email'), 'Format email tidak valid');
            isValid = false;
        }

        // Validasi Telepon
        const telepon = $('#telepon').val().trim();
        const phoneRegex = /^[0-9]+$/;
        if (telepon === '') {
            showError($('#telepon'), 'Nomor handphone wajib diisi');
            isValid = false;
        } else if (!phoneRegex.test(telepon)) {
            showError($('#telepon'), 'Hanya boleh berisi angka');
            isValid = false;
        } else if (telepon.length < 10 || telepon.length > 15) {
            showError($('#telepon'), 'Nomor handphone harus 10-15 digit');
            isValid = false;
        }

        // Validasi Pesan
        const pesan = $('#pesan').val().trim();
        if (pesan === '') {
            showError($('#pesan'), 'Pesan wajib diisi');
            isValid = false;
        } else if (pesan.length > 500) {
            showError($('#pesan'), 'Pesan maksimal 500 karakter');
            isValid = false;
        }

        // Jika semua valid, submit form
        if (isValid) {
            // Simulasi pengiriman data
            alert('Formulir valid! Data akan dikirim...');
            // Reset form
            this.reset();
        }
    });

    function showError(input, message) {
        const errorElement = input.next('.error-message');
        errorElement.text(message).addClass('active');
        input.addClass('error');
    }

    // Hapus error saat input diisi
    $('input, textarea').on('input', function() {
        $(this).removeClass('error');
        $(this).next('.error-message').removeClass('active');
    });
});
