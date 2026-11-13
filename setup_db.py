#!/usr/bin/env python3
import mysql.connector

password = "Nizari2412@@.!"
cnx = mysql.connector.connect(user="root", password=password, host="127.0.0.1", database="asili_udongo")
cursor = cnx.cursor()

# Categories
cursor.execute("CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
categories = ["Vyungu", "Vitambaa", "Taa", "Vitu"]
for cat in categories:
    cursor.execute("INSERT IGNORE INTO categories (name) VALUES (%s)", (cat,))
print(f"Inserted {len(categories)} categories")

# Products
cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    badge VARCHAR(50),
    image VARCHAR(500),
    hover_image VARCHAR(500),
    blurb TEXT,
    detail TEXT,
    maker VARCHAR(100),
    material VARCHAR(100),
    dimensions VARCHAR(100),
    palette VARCHAR(100),
    rating DECIMAL(3, 1),
    review_count INT DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    custom BOOLEAN DEFAULT FALSE,
    stock INT,
    sku VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category) REFERENCES categories(name)
)""")
products = [
    {"id": "terra-vessel", "name": "Chombo cha Udongo", "price": 185000, "category": "Vyungu", "badge": "Kipya",
     "image": "https://images.pexels.com/photos/33878988/pexels-photo-33878988.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125",
     "hoverImage": "https://images.pexels.com/photos/20362428/pexels-photo-20362428.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125",
     "blurb": "Umbo pana lenye msingi, uso mbichi nje na glasi ndani.",
     "detail": "Kila Chombo cha Udongo hufinyangwa kwa gurudumu katika studio ya Neema Mwaikambo huko Bagamoyo, hivya hakuna viwili vyenye mabega yanayofanana kabisa. Hupikwa mara mbili, kisha humaliziwa kwa mkono na glasi laini isiyo na sumu ndeni. Kimeundwa kwa matawi, nyasi ndefu — au kwa kuangaliwa tu.",
     "maker": "Neema Mwaikambo", "material": "Udongo wa Bagamoyo uliofinyangwa kwa mkono", "dimensions": "Kipenyo 18 × Urefu 32 sm", "palette": "Mchanga mbichi", "rating": 4.9, "reviewCount": 86, "stock": 9, "sku": "AU-101"},
    {"id": "dune-bud-vase", "name": "Chombo cha Maua", "price": 95000, "category": "Vyungu", "badge": "Kundi dogo",
     "image": "https://images.pexels.com/photos/7302803/pexels-photo-7302803.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125",
     "hoverImage": "https://images.pexels.com/photos/6739705/pexels-photo-6739705.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125",
     "blurb": "Chombo cha kiganja kimoja kwa shina moja, au kwa kitu chochote.",
     "detail": "Hutiwa moshi kwenye tanuru badala ya glasi, hivyo Chombo cha Maua hubaki na uso laini, kama chaki, wa udongo mbichi. Shingo nyembamba hushikilia shina moja wima; msingi mzito huhakikisha kinasimama imara.",
     "maker": "Neema Mwaikambo", "material": "Udongo uliotiwa moshi", "dimensions": "Kipenyo 10 × Urefu 21 sm", "palette": "Moshi", "rating": 4.8, "reviewCount": 41, "stock": 3, "sku": "AU-102"},
    {"id": "halden-mug", "name": "Kikombe cha Asubuhi", "price": 32000, "category": "Vyungu", "badge": "Kinachopendwa",
     "image": "https://images.pexels.com/photos/30712594/pexels-photo-30712594.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125",
     "hoverImage": "https://images.pexels.com/photos/31452608/pexels-photo-31452608.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125",
     "blurb": "Kikombe cha asubuhi cha 300ml mpini mkarimu, glasi laini.",
     "detail": "Tulimwomba mtengenezaji wetu kikombe anachokichukua nyumbani. Kikombe cha Asubuhi ni jibu: ukuta mzito kidogo kwa ajili ya joto, mpini wenye nafasi ya vidole viwili, na glasi inayobadilika kutoka rangi ya ngano hadi kijivu joto katika mwanga hafifu.",
     "maker": "Neema Mwaikambo", "material": "Udongo uliowekwa glasi", "dimensions": "Kipenyo 9 × Urefu 9 sm 300 ml", "palette": "Ngano", "rating": 5.0, "reviewCount": 212, "stock": 24, "sku": "AU-103"},
    {"id": "quiet-cups", "name": "Vikombe Vitulivu, Seti ya Viwili", "price": 58000, "category": "Vyungu",
     "image": "https://images.pexels.com/photos/31452608/pexels-photo-31452608.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125",
     "hoverImage": "https://images.pexels.com/photos/10622354/pexels-photo-10622354.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125",
     "blurb": "Vikombe vidogo viwili vya espresso, chai, au divai ya mwisho.",
     "detail": "Vikombe vidogo viwili vya espresso, chai, au divai ya mwisho. Chai lingine chini ya chini. Kila kikombeuna matumaini ya kubadilika kwa ajili ya chakula chochote unayofirana na mahitaji yako.",
     "maker": "Neema Mwaikambo", "material": "Udongo uliowekwa glasi", "dimensions": "Kipenyo 9 × Urefu 9 sm", "palette": "Ngano", "rating": 4.5, "reviewCount": 150, "stock": 12, "sku": "AU-104"}
]
for p in products:
    cursor.execute("""
    INSERT IGNORE INTO products 
    (id, name, price, category, badge, image, hover_image, blurb, detail, maker, material, dimensions, palette, rating, review_count, visible, custom, stock, sku)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (p["id"], p["name"], p["price"], p["category"], p["badge"], p["image"], p["hoverImage"],
            p["blurb"], p["detail"], p["maker"], p["material"], p["dimensions"], p["palette"],
            p["rating"], p["reviewCount"], p["visible"] if "visible" in p else True,
            p["custom"] if "custom" in p else False, p["stock"], p["sku"]))
print(f"Inserted {len(products)} products")

# Store settings
cursor.execute("""
CREATE TABLE IF NOT EXISTS store_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    announcement TEXT DEFAULT 'Usafirishaji bure kwa oda zaidi ya TSh 300,000',
    support_email VARCHAR(100) DEFAULT 'studio@asiliudongo.co.tz',
    shipping_fee DECIMAL(10, 2) DEFAULT 20000,
    free_shipping_threshold DECIMAL(10, 2) DEFAULT 300000,
    low_stock_threshold INT DEFAULT 4,
    store_open BOOLEAN DEFAULT TRUE,
    pin VARCHAR(10) DEFAULT '2468',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)""")
cursor.execute("INSERT IGNORE INTO store_settings (announcement, support_email, shipping_fee, free_shipping_threshold, low_stock_threshold, store_open, pin) VALUES ('Usafirishaji bure kwa oda zaidi ya TSh 300,000', 'studio@asiliudongo.co.tz', 20000, 300000, 4, TRUE, '2468')")
print("Store settings inserted")

# Other tables
for table in ["escrow_commissions", "shop_orders", "articles", "reviews", "activity_log"]:
    cursor.execute(f"CREATE TABLE IF NOT EXISTS {table} (id INT AUTO_INCREMENT PRIMARY KEY) ")
    print(f"{table} table created")

cnx.commit()
print("\nDatabase setup complete!")
cnx.close()
