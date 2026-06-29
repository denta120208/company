# Corporate Website for Food Export Company

## Project Overview

Develop a modern, responsive, and premium corporate website for a food export company. The company exports various FMCG brands such as biscuits, candies, noodles, beverages, coffee, snacks, seasonings, and other Indonesian products to international buyers.

The website is **NOT an e-commerce website**.

There is no shopping cart, checkout, payment gateway, or online ordering.

The website functions as a professional company profile combined with a digital product catalog for international buyers.

The design should be clean, premium, modern, elegant, and optimized for desktop, tablet, and mobile devices.

---

# Main Navigation

* Home
* Products
* About Us
* Contact

---

# HOME PAGE

Create a modern landing page with the following sections.

## Hero Section

Large background image/video.

Headline:

"Trusted Indonesian FMCG Export Partner"

Subheadline:

"We export high quality Indonesian food and consumer products worldwide."

Buttons:

* Explore Products
* Contact Us

---

## About Company Preview

Short company introduction.

Include:

* Years of experience
* Export countries
* Product categories
* Trusted suppliers

Button:

Read More

---

## Product Categories

Display categories in modern cards.

Example:

* Biscuits & Cookies
* Confectionery
* Instant Noodles
* Coffee
* Tea
* Snacks
* Beverages
* Seasonings
* Personal Care
* Home Care

Each category opens its own product page.

---

## Featured Brands

Display several featured brands.

Example:

* Oreo
* Indomie
* Kopiko
* Roma
* ABC
* Oishi

These are examples only.

Actual brands come from database.

---

## Why Choose Us

Cards

* Competitive Prices
* Worldwide Export
* Fast Response
* Professional Export Service
* Reliable Packaging
* Quality Assurance

---

## Export Countries

Interactive world map or country list.

---

## CTA

Interested in our products?

Contact us today.

---

# PRODUCTS PAGE

This page is fully dynamic.

Everything comes from database.

No hardcoded products.

---

## Left Sidebar

Categories

Example

All

Biscuits

Candy

Coffee

Snacks

Tea

Noodles

Seasoning

etc

---

## Main Content

Display Product Cards.

Example

Oreo

Product Image

5 Variants Available

View Details

Another Card

Indomie

12 Variants Available

View Details

Only ONE card per Brand.

Never create one card for every variant.

---

# PRODUCT DETAIL PAGE

When clicking Oreo.

Display

Hero Image

Brand Name

Brand Description

Available Variants

Example

* Strawberry Creme

* Chocolate Creme

* Vanilla

* Blueberry

* Double Creme

When user selects a variant, update the specification panel dynamically without leaving the page.

Specification Panel

Product Image

Description

Shelf Life

Content per Carton

Carton Length

Carton Width

Carton Height

Loading Capacity

20 FT

40 FT

Country of Origin

Request Quotation Button

Contact Us Button

Every specification comes from database.

---

# ABOUT US

Company Overview

Vision

Mission

Company Values

Export Experience

Certificates

Gallery

---

# CONTACT

Company Address

Google Maps

WhatsApp

Email

Contact Form

Business Hours

---

# ADMIN PANEL

Create secure authentication.

Admin Dashboard.

Sidebar

Dashboard

Products

Categories

Import Excel

Users

Settings

Logout

---

# SMART EXCEL IMPORT SYSTEM

This is the most important feature.

The company manages products using Excel.

Sometimes they upload 10 Excel files.

Each Excel represents one product category.

Example

Biscuits.xls

Candy.xls

Coffee.xls

Noodles.xls

etc.

The system must support importing multiple Excel files at once.

Drag & Drop upload.

Progress bar.

Validation.

Import logs.

---

# Excel Structure

Each row represents ONE PRODUCT VARIANT.

Example

Description

Shelf Life

Content per Carton

Length

Width

Height

20 FT

40 FT

Picture

Do NOT create one Product Card per row.

Instead,

Group variants into one Brand.

Example

Rows

Oreo Strawberry

Oreo Vanilla

Oreo Chocolate

Oreo Blueberry

Must become

Brand

Oreo

Variants

Strawberry

Vanilla

Chocolate

Blueberry

Another Example

Indomie Goreng

Indomie Soto

Indomie Kari Ayam

Becomes

Brand

Indomie

Variants

Goreng

Soto

Kari Ayam

---

# Import Flow

Admin uploads Excel files.

↓

System reads every sheet.

↓

Read every row.

↓

Detect Brand Name.

↓

If Brand already exists

Append Variant.

Else

Create Brand.

↓

Insert Variant.

↓

Save Specifications.

↓

Link Product Image.

↓

Finish Import.

---

# Duplicate Rules

If Variant already exists

Update it.

Do NOT duplicate.

---

# Import Result

Display

New Brands

New Variants

Updated Variants

Skipped Rows

Import Errors

Missing Images

Processing Time

---

# Database Design

Categories

* id
* name
* slug

Brands

* id
* category_id
* name
* slug
* thumbnail
* description

Variants

* id
* brand_id
* variant_name
* description
* shelf_life
* content_per_carton
* carton_length
* carton_width
* carton_height
* loading_capacity_20ft
* loading_capacity_40ft
* image

ImportLogs

* id
* filename
* imported_rows
* updated_rows
* failed_rows
* created_at

---

# Search

Search by

Brand

Variant

Category

---

# ADVANCED SMART EXCEL IMPORT ENGINE

This feature is the core of the entire system.

The company manages all products using Microsoft Excel.

The company already has approximately 10 different Excel files.

The website must be able to use these Excel files directly without requiring the client to manually recreate products from scratch.

The importer must be intelligent enough to transform Excel data into a structured product catalog.

---

## Multiple Excel Upload

The system must support uploading multiple Excel files simultaneously.

Example

Biscuits.xlsx

Candy.xlsx

Coffee.xlsx

InstantNoodles.xlsx

Snacks.xlsx

Tea.xlsx

Sauces.xlsx

Beverages.xlsx

Seasonings.xlsx

PersonalCare.xlsx

The admin selects all files and uploads them at once.

The importer processes them sequentially.

No manual product creation is required.

---

## Read Every Worksheet

Some Excel files may contain multiple worksheets.

The importer must automatically detect every worksheet.

Loop through every worksheet.

Loop through every row.

Skip empty rows.

Ignore title rows that are not product data.

---

## Dynamic Category Detection

Every uploaded Excel file represents one product category.

Example

Biscuits.xlsx

↓

Category = Biscuits

Coffee.xlsx

↓

Category = Coffee

Candy.xlsx

↓

Category = Candy

If the category does not exist

Create it automatically.

If it already exists

Reuse it.

Never create duplicate categories.

---

## Smart Brand Detection

The uploaded Excel DOES NOT always contain a dedicated Brand column.

The importer must automatically determine the Brand Name.

Primary Method

Use Brand Mapping.

Secondary Method

Parse the Description column.

Examples

"Oreo Sandwich Cookies Strawberry Creme"

Brand

Oreo

Variant

Sandwich Cookies Strawberry Creme

---

"Oreo Sandwich Cookies Vanilla"

Brand

Oreo

Variant

Sandwich Cookies Vanilla

---

"Indomie Mi Goreng"

Brand

Indomie

Variant

Mi Goreng

---

"Kopiko Coffee Candy"

Brand

Kopiko

Variant

Coffee Candy

---

"ABC Sardines Tomato"

Brand

ABC

Variant

Sardines Tomato

---

## Brand Mapping System

Create a Brand Mapping table inside the Admin Panel.

Example

Keyword

Oreo

↓

Brand

Oreo

---

Keyword

Indomie

↓

Brand

Indomie

---

Keyword

Kopiko

↓

Brand

Kopiko

---

Keyword

Roma

↓

Brand

Roma

---

Keyword

ABC

↓

Brand

ABC

Whenever the importer finds one of these keywords inside the Description column,

Automatically assign the correct Brand.

If no keyword matches,

Create a New Brand automatically.

---

## Variant Detection

Each row inside Excel represents ONE PRODUCT VARIANT.

Never create one Product Card for every row.

Instead,

Group all variants under the same Brand.

Example

Rows

Oreo Strawberry

Oreo Vanilla

Oreo Chocolate

Oreo Blueberry

↓

Website

Brand

Oreo

Variants

• Strawberry

• Vanilla

• Chocolate

• Blueberry

Another Example

Rows

Indomie Goreng

Indomie Soto

Indomie Kari Ayam

↓

Website

Brand

Indomie

Variants

• Mi Goreng

• Soto

• Kari Ayam

---

## Product Hierarchy

The hierarchy inside the database must be

Category

↓

Brand

↓

Variant

↓

Specification

Never store everything inside one table.

---

## Product Detail

Every Variant must store

Product Image

Description

Shelf Life

Packing

Content per Carton

Carton Length

Carton Width

Carton Height

Gross Weight

Net Weight

20 FT Capacity

40 FT Capacity

Origin Country

SKU (optional)

All specifications come from Excel.

---

## Image Handling

Some Excel files may contain embedded images.

Other Excel files may only contain image filenames.

The importer must support both.

Case 1

Embedded Images

↓

Extract image

↓

Save to Storage

↓

Link to Variant

Case 2

Image Filename

↓

Search image inside Upload Folder

↓

Attach image automatically

If image is missing

Display warning

Continue importing remaining products.

---

## Duplicate Detection

Never create duplicate Brands.

Never create duplicate Variants.

If Brand already exists

Reuse Brand.

If Variant already exists

Update Specifications.

Do not insert duplicates.

---

## Import Flow

Admin Login

↓

Dashboard

↓

Import Products

↓

Upload 10 Excel Files

↓

Validate Files

↓

Read Every Workbook

↓

Read Every Worksheet

↓

Read Every Row

↓

Determine Category

↓

Determine Brand

↓

Determine Variant

↓

Extract Product Specifications

↓

Extract Image

↓

Insert New Product

OR

Update Existing Product

↓

Generate Search Index

↓

Refresh Product Catalog

↓

Display Import Summary

---

## Import Summary

After import display

Number of Categories Created

Number of Brands Created

Number of Brands Updated

Number of Variants Created

Number of Variants Updated

Number of Images Imported

Rows Skipped

Rows Failed

Missing Images

Processing Time

Download Import Log

---

## Frontend Product Display

Products Page

Categories

↓

Brands

↓

Product Detail

↓

Variants

↓

Specifications

Only ONE Brand Card should appear on the Products page.

Never create hundreds of cards for every Excel row.

Example

Products

□ Oreo

5 Variants

□ Indomie

12 Variants

□ Kopiko

8 Variants

□ Roma

20 Variants

When clicking Oreo

Open Product Detail

Display all Oreo variants.

When selecting a Variant

Update specification dynamically without reloading the page.

The website should behave like a professional international FMCG export catalog rather than an e-commerce marketplace.

The admin should only need to upload Excel files, and the entire product catalog should update automatically without manual product entry.
