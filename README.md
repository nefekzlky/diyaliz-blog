# 🚀 Diyaliz Blog

Modern web standartlarına uygun şekilde sıfırdan geliştirilmiş, özel yönetim panelli Full-Stack CMS ve Blog altyapısıdır. İçerik yönetimi, kategori sistemi, medya optimizasyonu ve güvenli admin yapısıyla ölçeklenebilir bir blog deneyimi sunar.

---

## 🧱 Teknolojik Mimari

### Frontend
- ⚡ **Next.js** (App Router)
- 🎨 **Tailwind CSS**
- 🔄 **Axios**
- 📦 **React Hooks & Context API**

### Backend
- 🟢 **Node.js**
- 🚏 **Express.js**
- 🔐 **dotenv** tabanlı yapılandırma sistemi
- 📡 **REST API** mimarisi

### Veritabanı
- 🗄️ **MySQL**

### Medya ve Depolama
- ☁️ **Cloudinary** — Base64 şişirmesini önlemek, CDN destekli hızlı görsel dağıtımı ve otomatik optimizasyon sağlamak amacıyla kullanılmıştır.

---

## ✨ Öne Çıkan Özellikler

### 🛠️ Admin Dashboard

Tüm içeriklerin merkezi bir panel üzerinden yönetilebildiği özel bir yönetim sistemi.

- Yazı ekleme / düzenleme / silme
- Kategori yönetimi
- Sistem ayarlarını güncelleme
- İçerik organizasyonu

---

### 🔐 VIP Kalkanı — Güvenlik Katmanı

Admin erişimi için `.env` tabanlı özel güvenlik sistemi kullanılmıştır.

- Hassas bilgiler source code içerisine gömülmez
- Ortam bazlı güvenlik sağlanır
- Production ve Development yapılandırmaları ayrıştırılır

---

### ☁️ Bulut Medya Entegrasyonu

Görseller doğrudan veritabanında tutulmak yerine **Cloudinary** üzerinde saklanmaktadır.

- Veritabanı boyutunun gereksiz büyümesini önler
- Performansı artırır
- CDN desteği sayesinde görseller daha hızlı yüklenir

---

### 🔄 CRUD Operasyonları

Projede tam kapsamlı CRUD yapısı bulunmaktadır.

- Yazı oluşturma / güncelleme / silme
- Kategori oluşturma / düzenleme / silme

---

### 📱 Responsive Tasarım

Mobil, tablet ve masaüstü cihazlara tam uyumlu responsive yapı.

---

## 🗃️ Veritabanı Şeması

Projede temel olarak 3 ana tablo bulunmaktadır.

### `posts`
Blog yazılarının tutulduğu tablo.

| Alan | Açıklama |
|---|---|
| `id` | Birincil anahtar |
| `title` | Yazı başlığı |
| `slug` | URL dostu tanımlayıcı |
| `content` | İçerik |
| `image_url` | Cloudinary görsel URL'i |
| `category_id` | Kategori referansı |
| `created_at` | Oluşturulma tarihi |

### `categories`
Yazı kategorilerinin tutulduğu tablo.

| Alan | Açıklama |
|---|---|
| `id` | Birincil anahtar |
| `name` | Kategori adı |
| `slug` | URL dostu tanımlayıcı |

### `settings`
Siteye ait dinamik içeriklerin tutulduğu tablo. (Hakkımızda yazısı, sistem açıklamaları, genel site ayarları vb.)

---

### 🔗 İlişkisel Yapı

`posts.category_id` → `categories.id` alanına bağlıdır.

Kategori silindiğinde yazılar tamamen silinmez; `category_id` alanı `NULL` yapılır (`ON DELETE SET NULL`). Bu yaklaşım sayesinde veri kaybı önlenir ve içerik bütünlüğü korunur.

---

## 🧠 Mimari Yaklaşım

Bu proje geliştirilirken yalnızca çalışan bir blog sistemi oluşturmak değil, aynı zamanda ölçeklenebilir ve sürdürülebilir bir mimari kurmak hedeflenmiştir.

- Frontend ve Backend tamamen ayrıştırılmıştır
- RESTful API standartları uygulanmıştır
- Ortam değişkenleriyle güvenli yapılandırma sağlanmıştır
- Medya yönetimi dış servis mimarisiyle optimize edilmiştir

Bu yapı sayesinde proje daha kolay bakım yapılabilir, performanslı ve gerçek dünya projelerine yakın bir mimari sunar.

---

## 👨‍💻 Geliştirici

**Necmettin Efe KIZILKAYA**

- 🔗 LinkedIn: `https://www.linkedin.com/in/necmettinefekizilkaya/`

---

> Bu proje kişisel öğrenim sürecinin yanında gerçek dünya Full-Stack mimarilerini deneyimlemek amacıyla geliştirilmiştir. Modern web teknolojileri, REST API yapısı, medya optimizasyonu ve yönetim paneli mimarisi üzerine yoğunlaşılmıştır.