# Sever Deri — Kurumsal Web Sitesi

Sever Deri deri üretim atölyesini tanıtan, çok sayfalı statik web sitesi. Derleme adımı gerektirmez; dosyalar herhangi bir statik sunucuda (GitHub Pages, Netlify, klasik hosting) doğrudan yayınlanabilir.

## Sayfalar

| Dosya | Sayfa |
| --- | --- |
| `index.html` | Anasayfa |
| `hakkimizda.html` | Hakkımızda |
| `urunlerimiz.html` | Ürünlerimiz (deri çeşitleri) |
| `hizmetlerimiz.html` | Hizmetlerimiz |
| `iletisim.html` | İletişim (form + harita) |

## Yapı

```
css/style.css       Tüm stiller
js/main.js          Mobil menü, aktif menü, animasyonlar, iletişim formu
assets/favicon.svg  Logo / site ikonu
```

## Düzenlenmesi gerekenler

Aşağıdaki bilgiler örnek olarak girilmiştir, gerçek bilgilerle değiştirin:

- **Adres, telefon, WhatsApp, e-posta, çalışma saatleri** — `iletisim.html` ile her sayfanın üst bilgi çubuğu, mobil menüsü ve alt bilgisi (footer)
- **Instagram / Facebook bağlantıları** — her sayfadaki `social` bloklarında (şu an genel adreslere gidiyor)
- **Form alıcı e-postası** — `js/main.js` içindeki `CONTACT_EMAIL`
- **Harita** — `iletisim.html` içindeki `iframe` `src` adresi (Google Maps > Paylaş > Harita yerleştir)

İletişim formu bir sunucuya bağlı değildir; gönderildiğinde ziyaretçinin e-posta uygulamasını dolu bir mesajla açar.

## Yerelde çalıştırma

```sh
python3 -m http.server 8000
# http://localhost:8000 adresini açın
```
