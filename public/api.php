<?php
// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database paths
$db_file = __DIR__ . '/orders.json';
$config_file = __DIR__ . '/config.json';
$products_file = __DIR__ . '/products.json';
$portfolio_file = __DIR__ . '/portfolio.json';
$blog_file = __DIR__ . '/blog.json';
$site_info_file = __DIR__ . '/site-info.json';
$content_file = __DIR__ . '/content.json';

// Initialize files if they don't exist
if (!file_exists($db_file)) {
    $initial_orders = [
        [
            "id" => "ORD-7721",
            "type" => "IT",
            "customerName" => "Marcus Aurelius",
            "customerEmail" => "marcus@stoic.co",
            "status" => "Provisioned",
            "details" => ["plan" => "Cloud Migration", "nodes" => 12],
            "createdAt" => date(DATE_ISO8601, time() - 86400),
            "notifications" => ["Login credentials sent to client", "New order received from landing page"]
        ]
    ];
    file_put_contents($db_file, json_encode($initial_orders, JSON_PRETTY_PRINT));
}

if (!file_exists($config_file)) {
    $default_config = [
        "username" => "admin",
        "password" => "password",
        "stripePublishableKey" => "",
        "stripeSecretKey" => "",
        "paypalClientId" => "",
        "canvaApiKey" => "",
        "canva" => ["createUrl" => "https://www.canva.com/", "templates" => []],
        "paymentMode" => "sandbox",
        "deliveryFee" => 35,
        "premiumDeliveryFee" => 45,
        "premiumClients" => ["Jastel Water", "Surjen Healthcare"]
      ];
      file_put_contents($config_file, json_encode($default_config, JSON_PRETTY_PRINT));
}

if (!file_exists($products_file)) {
    $initial_products = [
        [
            "id" => "t-shirts",
            "label" => "T-shirts / Branded Apparel",
            "description" => "Ultra-soft organic cotton garments silkscreened with water-based eco-inks.",
            "basePrice" => 20,
            "unitLabel" => "Garments",
            "minOrderWeightKg" => 10,
            "weightPerUnitKg" => 0.2,
            "category" => "printing"
        ],
        [
            "id" => "caps",
            "label" => "Custom Branded Caps",
            "description" => "High-quality headwear featuring custom embroidery or precision prints.",
            "basePrice" => 12,
            "unitLabel" => "Caps",
            "minOrderWeightKg" => 10,
            "weightPerUnitKg" => 0.15,
            "category" => "printing"
        ],
        [
            "id" => "banners",
            "label" => "Banners (Roll-up, Pull-up)",
            "description" => "Durable weather-proof canvas banners fitted with polished silver bamboo or aluminum constructs.",
            "basePrice" => 48,
            "unitLabel" => "Banners",
            "minOrderWeightKg" => 10,
            "weightPerUnitKg" => 0.5,
            "category" => "printing"
        ],
        [
            "id" => "stickers",
            "label" => "Stickers & Die-Cut Labels",
            "description" => "Premium vinyl labels with a smooth, glare-free matte varnish suitable for packaging.",
            "basePrice" => 0.22,
            "unitLabel" => "Labels",
            "minOrderWeightKg" => 10,
            "weightPerUnitKg" => 0.015,
            "category" => "printing"
        ],
        [
            "id" => "mugs",
            "label" => "Branded Mugs & Drinkware",
            "description" => "Handcrafted ceramic mugs or insulated travel containers with vibrant, lasting prints.",
            "basePrice" => 5.5,
            "unitLabel" => "Mugs",
            "minOrderWeightKg" => 10,
            "weightPerUnitKg" => 0.35,
            "category" => "printing"
        ],
        [
            "id" => "notebooks",
            "label" => "Notebooks & Note pads",
            "description" => "Hardcover hand-bound grid notebooks or soft-cover branded pads with recycled stock.",
            "basePrice" => 6,
            "unitLabel" => "Notebooks",
            "minOrderWeightKg" => 10,
            "weightPerUnitKg" => 0.35,
            "category" => "printing"
        ],
        [
            "id" => "menus",
            "label" => "Menus & Restaurant Stationery",
            "description" => "Water-resistant, beautifully typeset menu cards and table talkers for hospitality.",
            "basePrice" => 4.5,
            "unitLabel" => "Menus",
            "minOrderWeightKg" => 10,
            "weightPerUnitKg" => 0.05,
            "category" => "printing"
        ],
        [
            "id" => "custom",
            "label" => "Other Custom Printing (Bespoke)",
            "description" => "Got an unusual canvas, card, or box? Describe your dimension and material dreams below.",
            "basePrice" => 15,
            "unitLabel" => "Pieces",
            "minOrderWeightKg" => 10,
            "weightPerUnitKg" => 0.2,
            "category" => "printing"
        ]
    ];
    file_put_contents($products_file, json_encode($initial_products, JSON_PRETTY_PRINT));
}

if (!file_exists($portfolio_file)) {
    file_put_contents($portfolio_file, json_encode([], JSON_PRETTY_PRINT));
}

if (!file_exists($blog_file)) {
    file_put_contents($blog_file, json_encode([], JSON_PRETTY_PRINT));
}

if (!file_exists($site_info_file)) {
    $default_site_info = [
        "phone" => "",
        "email" => "",
        "address" => "",
        "openingHours" => "",
        "closingHours" => "",
        "socials" => ["x" => "", "tiktok" => "", "instagram" => "", "linkedin" => ""],
        "brandTagline" => ""
    ];
    file_put_contents($site_info_file, json_encode($default_site_info, JSON_PRETTY_PRINT));
}

if (!file_exists($content_file)) {
    $default_content_json = '{"homepage":{"heroTitle":"Optimizing Businesses.","heroSubtitle":"Cuva Tech is your full-service crew for IT solutions, branding & printing, and digital marketing. Growing businesses get one calm partner instead of five vendors.","heroCtaPrimary":"Start a project","heroCtaSecondary":"See what we do","stats":[{"value":"120+","label":"projects"},{"value":"98%","label":"retention"},{"value":"24/7","label":"support"}],"coreOverview":{"eyebrow":"Core Ecosystem","title":"Three Unified Creative Practices","cards":[{"title":"IT Solutions","description":"Onsite servers migrated seamlessly to AWS & GCP cloud meshes, configured with multi-region backup structures."},{"title":"Branding & Print","description":"Logo design, Print Shop (T-shirts, Caps, Menus, etc.), and Free Consultations for your brand identity."},{"title":"Digital Marketing","description":"On-page SEO diagnostics, semantic keyword maps, Meta & Google Ad sandbox campaigns focused on CPA."}]},"brandingSection":{"title":"Branding, Logos & Print","subtitle":"We design lasting brandmarks and print them on premium, eco-friendly assets. Choose between linking your Canva projects directly or using our custom product configurators."},"itSection":{"title":"IT Solutions & Systems","subtitle":"Quiet, bulletproof infrastructure built for creative minds. We draft setups using paper-based clarity before engineering cloud architectures that withstand massive traffic peaks."},"marketingSection":{"title":"Digital Marketing and Business Insights","subtitle":"Quiet, human-intent marketing campaigns designed to convert high-value leads. No flashing triggers, just clean visibility that speaks clearly to decision makers in tech and design.","seo":{"eyebrow":"Organic Traffic Engine [SEO]","headline":"SEO audits with","headlineAccent":"high-intent precision.","description":"We don\u2019t chase vanity metrics or write robotic AI paragraphs. We design deep technical crawls, semantic HTML guidelines, structural schema mapping, and coordinate hand-researched industry backlinks.","bullets":["On-page performance audit & loading speed acceleration","Strategic key-phrase mapping targeting zero-volume vanity overrides","Semantic schemas for deep snippet categorization","Bespoke link curation in high-authority tech/design logs"]},"ads":{"eyebrow":"Targeted Ad Networks [Paid Campaigns]","headline":"Direct conversions,","headlineAccent":"minimal expenditure waste.","description":"We deploy targeted Google Search, Meta Social, and LinkedIn B2B structures. We structure precise audiences with high buyers intent, craft high-editorial design hooks, and report performance with absolute clarity.","didYouKnow":"Google Ads targeting exact high-intent schemas see a 42% decrease in cost-per-click compared to wide AI auto-matching structures."},"social":{"eyebrow":"Platform Presence [Social Media]","headline":"Authentic storytelling,","headlineAccent":"beautifully typeset.","description":"We formulate custom content schedules across LinkedIn, Instagram, and X/Twitter. We curate thought-provoking threads, designs, and case histories that engage peers."},"analytics":{"eyebrow":"Data & Retention [Analytics & Email]","headline":"Actionable insights,","headlineAccent":"tailored messaging.","description":"We bridge the gap between raw data and creative strategy. From deep GA4 audits to highly-personalized email automation, we ensure every touchpoint is measured and meaningful.","bullets":["Advanced GA4 / GTM implementation and event tracking","Custom performance dashboards and conversion path analysis","Drip-campaign architecture and high-editorial email design","A/B testing protocols for landing pages and subject lines"]}}},"navbar":[{"id":"hero","label":"Home"},{"id":"it-services","label":"IT Services"},{"id":"branding-printing","label":"Branding & Printing"},{"id":"digital-marketing","label":"Marketing"},{"id":"printing-jobs","label":"Printing Jobs"},{"id":"blog","label":"Journal"},{"id":"testimonials","label":"Reviews"},{"id":"contact","label":"Say Hello"}],"footer":{"tagline":"We use technology to improve performance and productivity making sure there is alignment in the business goals and technology requirements for every business","newsletterEyebrow":"STUDIO DISPATCH","newsletterTitle":"Subscribe to local brand logs","newsletterSubtitle":"Thoughtful paragraphs about server configurations, print inks, and layout theories.","columns":[{"title":"Sections","links":[{"label":"Homepage","target":"hero"},{"label":"IT Cloud Systems","target":"it-services"},{"label":"Printing Configs","target":"branding-printing"},{"label":"Digital Marketing","target":"digital-marketing"}]},{"title":"Company","links":[{"label":"Our Story","target":"about-us"},{"label":"Client Reviews","target":"testimonials"},{"label":"Contact Studio","target":"contact"},{"label":"Admin Portal","target":"admin"}]}],"copyright":"\u00a9 2026 Cuva Tech."},"about":{"eyebrow":"Our Story & Values","title":"Everything starts with","titleAccent":"craftsmanship.","subtitle":"We are a multi-service technology and creative synthesis studio. We believe that technology should feel less like cold aluminum servers, and more like beautiful, warm physical stationery.","storyButton":"Read Our Full Story","modalEyebrow":"Cuva Origins","modalTitle":"Our Story & Mission","story":{"heading":"Bridging the gap between heavy cloud infrastructure and manual typography.","paragraphs":["Founded in Dublin in 2024, Cuva Tech emerged from a simple question: Why must high-performance IT solutions feel so sterile? Our founder, Efe Cuva, spent years wiring remote database nodes across heavy financial networks, yet spent weekends collecting manual handpressed journals and studying print ink absorption rules.","We realized that the best brands aren\u2019t built with off-the-shelf automated scripts or template blocks. They require bespoke physical presence combined with weightless, secure cloud engines."],"principles":[{"eyebrow":"Symmetry","title":"Symmetrical Synthesis","text":"Your website layout, search keywords, and actual printed invoicing books are custom engineered in tandem."},{"eyebrow":"Quality","title":"Uncompromising","text":"No cookie-cutter AI automation codes. Everything is adjusted, compiled, and hand-sketched by lead designers."}],"missionLabel":"OUR MISSION","mission":"To humanize the digital workspace by engineering bulletproof cloud systems and elegant material craft that commands respect, builds trust, and endures.","visionLabel":"OUR VISION","vision":"We envision a technological landscape where digital interfaces preserve personal craftsmanship, where infrastructure represents high design, and where client relations are cultivated through quiet competence and tea."},"teamEyebrow":"The Architects","teamTitle":"Our Leading Craftsmen"},"services":{"it":[{"id":"hardware-software-setup","title":"Hardware/Software Setup","tagline":"Precision installs for seamless operations.","description":"Expert physical and virtual setups to get your office running at peak efficiency.","bullets":["Printer & peripheral installation","POS (Point of Sale) system integration","Desktop & workstation deployment","CRM & enterprise software integration"]},{"id":"it-infrastructure","title":"IT Infrastructure Support & Management","tagline":"Quiet, bulletproof systems for creative minds.","description":"Ongoing management and support to ensure your technology never stands in the way of your growth.","bullets":["AI integration & workflow automation","Remote technical support & monitoring","Secure network architecture & maintenance","Cloud solutions & virtualization"]},{"id":"web-development","title":"Web Development","tagline":"High-performance digital experiences.","description":"Custom web solutions designed for speed, security, and exceptional user experience.","bullets":["Responsive frontend architecture","Scalable backend systems","E-commerce & custom web apps","Ongoing maintenance & performance optimization"]},{"id":"cloud-solutions","title":"Cloud Solutions","tagline":"Elastic, secure, and always accessible.","description":"Modernize your workflow with cloud-native architectures that scale with your business.","bullets":["AWS, GCP & Azure migrations","Cloud-based backup & disaster recovery","Serverless computing & microservices","Cost-optimized cloud footprints"]},{"id":"software-development","title":"Software Development","tagline":"Bespoke tools for complex challenges.","description":"Engineered software solutions tailored precisely to your internal business processes.","bullets":["Custom business logic & internal tools","API development & integration","Mobile-first software solutions","Legacy system modernization"]}],"itBanner":{"title":"Unsure about legacy database frameworks?","text":"We offer free, zero-commitment physical tech audits. Let our principal systems architect sit down with you (via video call or hot tea) to map out your architecture securely.","cta":"Schedule System Audit"}},"testimonials":[{"id":"t1","name":"Efe Jastel","company":"Jastel Water","sector":"Beverage Distribution","role":"Operations Manager","review":"Cuva Tech transformed our bottled water branding and packaging. Their custom label printing and delivery service ensured our products reached every corner of the city. The 10kg minimum order was perfect for our distribution needs.","rating":5,"serviceType":"Branding","date":"May 2026"},{"id":"t2","name":"Dr. Sarah Ngu","company":"Surjen Healthcare","sector":"Healthcare Supplies","role":"Procurement Director","review":"Our medical facility required high-quality printed materials with specific delivery requirements. Cuva Tech delivered branded health brochures and safety signage with their premium handling service. Outstanding attention to detail for healthcare protocols.","rating":5,"serviceType":"Branding","date":"June 2026"},{"id":"t3","name":"Amina Hassan","company":"Nubien Spa","sector":"Wellness & Spa","role":"Spa Director","review":"The custom branded amenity kits and menu cards elevated our spa experience. Cuva Tech understood our luxury positioning and delivered materials that matched our premium service standards.","rating":5,"serviceType":"Branding","date":"April 2026"},{"id":"t4","name":"Marcus Johnson","company":"Five Toes Plus","sector":"Retail & Fashion","role":"Store Owner","review":"Our retail chain needed consistent branding across 15 locations. Cuva Tech handled our tote bags, signage, and shopping bags with impeccable quality and on-time delivery.","rating":5,"serviceType":"Branding","date":"May 2026"},{"id":"t5","name":"James Halibiz","company":"Halibiz Industries","sector":"Manufacturing","role":"Plant Manager","review":"We required industrial safety signage and equipment labeling in bulk quantities. Cuva Tech met our 10kg minimum order requirement and delivered weather-resistant materials that exceeded expectations.","rating":4.8,"serviceType":"Branding","date":"March 2026"},{"id":"t6","name":"David Bodyfit","company":"Body Solutions Garage","sector":"Fitness & Wellness","role":"Founder","review":"Custom workout programs printed in beautiful softcover notebooks for our clients. Cuva Tech understood the fitness industry aesthetic and delivered materials that motivate our members.","rating":5,"serviceType":"Branding","date":"June 2026"},{"id":"t7","name":"Rev. Samuel Okonkwo","company":"The Leprosy Mission Abuja","sector":"Nonprofit","role":"Communications Director","review":"As a nonprofit, we needed professional printed materials for our outreach programs. Cuva Tech provided exceptional service at reasonable rates, helping us communicate our mission with dignity and clarity.","rating":5,"serviceType":"Branding","date":"January 2026"},{"id":"t8","name":"Richard Sherman","company":"Sherman Pour Co Illinois","sector":"Industrial Manufacturing","role":"Production Manager","review":"Our chemical pouring equipment manuals and safety documentation needed precise printing. Cuva Tech handled technical specifications with accuracy and their delivery service ensured timely arrival at our Illinois facility.","rating":4.9,"serviceType":"IT","date":"April 2026"},{"id":"t9","name":"David Scott","company":"David Scott Fashion","sector":"Fashion & Apparel","role":"Creative Director","review":"The custom printed lookbooks and fabric tags elevated our fashion showcase. Cuva Tech understood luxury fashion branding and delivered materials that complemented our seasonal collection perfectly.","rating":5,"serviceType":"Branding","date":"February 2026"},{"id":"t10","name":"Coach Michael Springfield","company":"Springfield Intl Soccer Club","sector":"Sports & Athletics","role":"Team Manager","review":"Team jerseys, program booklets, and branded merchandise for our international matches. Cuva Tech delivered on their 10kg minimum order promise and helped our club look professional on the field.","rating":5,"serviceType":"Branding","date":"May 2026"}]}';
    $default_content = json_decode($default_content_json, true);
    file_put_contents($content_file, json_encode($default_content, JSON_PRETTY_PRINT));
}

// Routing based on the path parameter rewritten by .htaccess
$path = isset($_GET['path']) ? $_GET['path'] : '';

// Helper to read JSON inputs
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

function getConfigWithDeliveryDefaults($config_file) {
    $config = json_decode(file_get_contents($config_file), true);
    if (!is_array($config)) {
        $config = [];
    }

    if (!array_key_exists('deliveryFee', $config)) $config['deliveryFee'] = 35;
    if (!array_key_exists('premiumDeliveryFee', $config)) $config['premiumDeliveryFee'] = 45;
    if (!array_key_exists('premiumClients', $config)) $config['premiumClients'] = ['Jastel Water', 'Surjen Healthcare'];

    return $config;
}

function readJsonFile($file, $fallback = []) {
    if (!file_exists($file)) {
        return $fallback;
    }

    $data = json_decode(file_get_contents($file), true);
    return is_array($data) ? $data : $fallback;
}

function writeJsonFile($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

function readJsonFileRaw($file, $fallback = null) {
    if (!file_exists($file)) {
        return $fallback;
    }
    $data = json_decode(file_get_contents($file), true);
    return $data !== null ? $data : $fallback;
}

function slugify($text) {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/\s+/', '-', $text);
    $text = preg_replace('/-+/', '-', $text);
    return trim($text, '-');
}

// Generic deep merge for the editable content document. Plain objects merge
// recursively; arrays and scalars from the override replace the base.
function deepMergeContent($base, $override) {
    if (!is_array($base) || !is_array($override)) {
        return $override === null ? $base : $override;
    }
    $out = $base;
    foreach ($override as $key => $value) {
        if (is_string($key)) {
            if (is_array($base[$key] ?? null) && is_array($value) && array_keys($base[$key]) !== range(0, count($base[$key]) - 1) && array_keys($value) !== range(0, count($value) - 1)) {
                $out[$key] = deepMergeContent($base[$key], $value);
            } else {
                $out[$key] = $value;
            }
        } else {
            $out[] = $value;
        }
    }
    return $out;
}

// Read products and normalize any non-URL-safe id (e.g. one containing a slash
// or spaces) so PUT/DELETE by id route correctly. Writes back only when changed.
function getProducts() {
    global $products_file;
    $products = readJsonFile($products_file);
    $changed = false;
    $seen = [];
    foreach ($products as &$product) {
        if (!isset($product['id']) || !is_string($product['id'])) {
            $product['id'] = 'product-' . count($seen);
            $changed = true;
        } else {
            $safe = slugify($product['id']);
            if ($safe !== $product['id']) {
                $product['id'] = $safe;
                $changed = true;
            }
        }
        // Guarantee uniqueness after normalization
        if (in_array($product['id'], $seen, true)) {
            $candidate = $product['id'] . '-' . count($seen);
            $product['id'] = $candidate;
            $changed = true;
        }
        $seen[] = $product['id'];
    }
    unset($product);
    if ($changed) {
        writeJsonFile($products_file, $products);
    }
    return $products;
}

function requireAdmin() {
    $auth = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    $token = '';
    if (preg_match('/^Bearer\s+(.+)$/', $auth, $m)) {
        $token = trim($m[1]);
    }
    if ($token !== 'cuva_admin_secure_session_token') {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }
}

// Route: admin/login
if ($path === 'admin/login') {
    $input = getJsonInput();
    $config = json_decode(file_get_contents($config_file), true);
    
    if (isset($input['username']) && isset($input['password']) && 
        $input['username'] === $config['username'] && $input['password'] === $config['password']) {
        echo json_encode(["token" => "cuva_admin_secure_session_token"]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password"]);
    }
    exit();
}

// Route: admin/change-password
if ($path === 'admin/change-password') {
    $input = getJsonInput();
    $config = json_decode(file_get_contents($config_file), true);
    
    if (!isset($input['currentPassword']) || $input['currentPassword'] !== $config['password']) {
        http_response_code(400);
        echo json_encode(["error" => "Incorrect current password"]);
        exit();
    }
    
    $config['password'] = $input['newPassword'];
    file_put_contents($config_file, json_encode($config, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true]);
    exit();
}

// Route: admin/settings
if ($path === 'admin/settings') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $config = getConfigWithDeliveryDefaults($config_file);
        unset($config['password']); // Safety first
        echo json_encode($config);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = getJsonInput() ?: [];
        $config = getConfigWithDeliveryDefaults($config_file);
        
        if (array_key_exists('stripePublishableKey', $input)) $config['stripePublishableKey'] = $input['stripePublishableKey'];
        if (array_key_exists('stripeSecretKey', $input)) $config['stripeSecretKey'] = $input['stripeSecretKey'];
        if (array_key_exists('paypalClientId', $input)) $config['paypalClientId'] = $input['paypalClientId'];
        if (array_key_exists('canvaApiKey', $input)) $config['canvaApiKey'] = $input['canvaApiKey'];
        if (array_key_exists('paymentMode', $input)) $config['paymentMode'] = $input['paymentMode'];
        if (array_key_exists('deliveryFee', $input) && (!is_numeric($input['deliveryFee']) || floatval($input['deliveryFee']) < 0)) {
            http_response_code(400);
            echo json_encode(["error" => "deliveryFee must be zero or greater"]);
            exit();
        }
        if (array_key_exists('premiumDeliveryFee', $input) && (!is_numeric($input['premiumDeliveryFee']) || floatval($input['premiumDeliveryFee']) < 0)) {
            http_response_code(400);
            echo json_encode(["error" => "premiumDeliveryFee must be zero or greater"]);
            exit();
        }
        if (array_key_exists('deliveryFee', $input)) $config['deliveryFee'] = floatval($input['deliveryFee']);
        if (array_key_exists('premiumDeliveryFee', $input)) $config['premiumDeliveryFee'] = floatval($input['premiumDeliveryFee']);
        if (array_key_exists('premiumClients', $input) && is_array($input['premiumClients'])) $config['premiumClients'] = $input['premiumClients'];
        if (array_key_exists('canva', $input) && is_array($input['canva'])) $config['canva'] = $input['canva'];

        file_put_contents($config_file, json_encode($config, JSON_PRETTY_PRINT));
        unset($config['password']);
        echo json_encode($config);
    }
    exit();
}

// Route: settings/public
if ($path === 'settings/public') {
    $config = getConfigWithDeliveryDefaults($config_file);
    echo json_encode([
        "stripePublishableKey" => isset($config['stripePublishableKey']) ? $config['stripePublishableKey'] : '',
        "paypalClientId" => isset($config['paypalClientId']) ? $config['paypalClientId'] : '',
        "paymentMode" => isset($config['paymentMode']) ? $config['paymentMode'] : 'sandbox',
        "deliveryFee" => $config['deliveryFee'],
        "premiumDeliveryFee" => $config['premiumDeliveryFee'],
        "premiumClients" => $config['premiumClients'],
        "canva" => isset($config['canva']) ? $config['canva'] : ["createUrl" => "https://www.canva.com/", "templates" => []]
    ]);
    exit();
}

// Route: products
if ($path === 'products') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $products = getProducts();
        echo json_encode($products);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = getJsonInput();
        $products = getProducts();

        $id = isset($input['id']) ? trim($input['id']) : '';
        $label = isset($input['label']) ? trim($input['label']) : '';
        $unit_label = isset($input['unitLabel']) ? trim($input['unitLabel']) : '';

        $base_price = isset($input['basePrice']) && is_numeric($input['basePrice']) ? floatval($input['basePrice']) : 0;
        $min_order_weight_kg = isset($input['minOrderWeightKg']) && is_numeric($input['minOrderWeightKg']) ? floatval($input['minOrderWeightKg']) : 0;
        $weight_per_unit_kg = isset($input['weightPerUnitKg']) && is_numeric($input['weightPerUnitKg']) ? floatval($input['weightPerUnitKg']) : 0;

        if ($label === '' || $unit_label === '' || $base_price <= 0 || $min_order_weight_kg <= 0 || $weight_per_unit_kg <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Missing or invalid required fields: label, basePrice, unitLabel, minOrderWeightKg, weightPerUnitKg"]);
            exit();
        }

        // Product IDs must be URL-safe so PUT/DELETE by id route correctly.
        // Slugify the provided id, falling back to the label when none is given.
        $raw_id = $id !== '' ? slugify($id) : slugify($label);
        if ($raw_id === '') {
            http_response_code(400);
            echo json_encode(["error" => "A valid product id (or label) is required"]);
            exit();
        }

        foreach ($products as $product) {
            if (isset($product['id']) && $product['id'] === $raw_id) {
                http_response_code(400);
                echo json_encode(["error" => "Product ID already exists"]);
                exit();
            }
        }

        $new_product = [
            "id" => $raw_id,
            "label" => $label,
            "description" => isset($input['description']) ? $input['description'] : '',
            "basePrice" => $base_price,
            "unitLabel" => $unit_label,
            "minOrderWeightKg" => floatval($min_order_weight_kg),
            "weightPerUnitKg" => $weight_per_unit_kg,
            "category" => isset($input['category']) ? $input['category'] : 'printing',
            "imageUrl" => isset($input['imageUrl']) && $input['imageUrl'] ? $input['imageUrl'] : null
        ];

        $products[] = $new_product;
        writeJsonFile($products_file, $products);

        http_response_code(201);
        echo json_encode($new_product);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
    exit();
}

// Route: products/:id
if (preg_match('/^products\/([^\/]+)$/', $path, $matches)) {
    $product_id = $matches[1];
    $products = getProducts();

    $product_index = -1;
    foreach ($products as $index => $product) {
        if (isset($product['id']) && $product['id'] === $product_id) {
            $product_index = $index;
            break;
        }
    }

    if ($product_index === -1) {
        http_response_code(404);
        echo json_encode(["error" => "Product not found"]);
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = getJsonInput();
        $product = $products[$product_index];

        if (array_key_exists('label', $input)) {
            $product['label'] = $input['label'];
        }
        if (array_key_exists('description', $input)) {
            $product['description'] = $input['description'];
        }
        if (array_key_exists('basePrice', $input)) {
            if (!is_numeric($input['basePrice']) || floatval($input['basePrice']) <= 0) {
                http_response_code(400);
                echo json_encode(["error" => "basePrice must be greater than zero"]);
                exit();
            }
            $product['basePrice'] = floatval($input['basePrice']);
        }
        if (array_key_exists('unitLabel', $input)) {
            $product['unitLabel'] = $input['unitLabel'];
        }
        if (array_key_exists('minOrderWeightKg', $input)) {
            $min_order_weight_kg = is_numeric($input['minOrderWeightKg']) ? floatval($input['minOrderWeightKg']) : 0;
            if ($min_order_weight_kg <= 0) {
                http_response_code(400);
                echo json_encode(["error" => "minOrderWeightKg must be greater than zero"]);
                exit();
            }
            $product['minOrderWeightKg'] = floatval($min_order_weight_kg);
        }
        if (array_key_exists('weightPerUnitKg', $input)) {
            $weight_per_unit_kg = is_numeric($input['weightPerUnitKg']) ? floatval($input['weightPerUnitKg']) : 0;
            if ($weight_per_unit_kg <= 0) {
                http_response_code(400);
                echo json_encode(["error" => "weightPerUnitKg must be greater than zero"]);
                exit();
            }
            $product['weightPerUnitKg'] = $weight_per_unit_kg;
        }
        if (array_key_exists('category', $input)) {
            $product['category'] = $input['category'];
        }
        if (array_key_exists('imageUrl', $input)) {
            if ($input['imageUrl']) {
                $product['imageUrl'] = $input['imageUrl'];
            } else {
                unset($product['imageUrl']);
            }
        }

        $products[$product_index] = $product;
        writeJsonFile($products_file, $products);

        echo json_encode($product);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        array_splice($products, $product_index, 1);
        writeJsonFile($products_file, $products);

        echo json_encode(["success" => true, "message" => "Product " . $product_id . " deleted"]);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
    exit();
}

// Route: orders
if ($path === 'orders') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo file_get_contents($db_file);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = getJsonInput();
        $orders = json_decode(file_get_contents($db_file), true);
        
        $newOrder = [
            "id" => "ORD-" . rand(1000, 9999),
            "type" => isset($input['type']) ? $input['type'] : 'Contact',
            "customerName" => isset($input['customerName']) ? $input['customerName'] : '',
            "customerEmail" => isset($input['customerEmail']) ? $input['customerEmail'] : '',
            "details" => isset($input['details']) ? $input['details'] : [],
            "status" => "Pending",
            "createdAt" => date(DATE_ISO8601),
            "notifications" => ["New order received from landing page"]
        ];
        
        array_unshift($orders, $newOrder);
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        
        // --- SEND NOTIFICATION EMAIL TO info@cuvatech.com ---
        $to = "info@cuvatech.com";
        $subject = "New Cuva Tech Docket: " . $newOrder['type'] . " Order (" . $newOrder['id'] . ")";
        
        // Strip image base64 raw string from the email body to keep the email clean and prevent spam blocks
        $cleanDetails = $newOrder['details'];
        if (isset($cleanDetails['fileData'])) {
            $cleanDetails['fileData'] = '[Image Base64 Data Uploaded Successfully]';
        }
        
        $message = "You have received a new service order on Cuva Tech.\n\n";
        $message .= "ID: " . $newOrder['id'] . "\n";
        $message .= "Service Type: " . $newOrder['type'] . "\n";
        $message .= "Customer: " . $newOrder['customerName'] . " (" . $newOrder['customerEmail'] . ")\n";
        $message .= "Date: " . $newOrder['createdAt'] . "\n\n";
        $message .= "Order Details:\n" . print_r($cleanDetails, true) . "\n\n";
        $message .= "Manage this order inside your admin panel: https://" . $_SERVER['HTTP_HOST'] . "/admin\n";
        
        $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n" .
                   "Reply-To: " . $newOrder['customerEmail'] . "\r\n" .
                   "X-Mailer: PHP/" . phpversion();
        
        // Send mail (cPanel handles this via sendmail)
        @mail($to, $subject, $message, $headers);
        
        echo json_encode($newOrder);
    }
    exit();
}

// Route: orders/:id/status
if (preg_match('/^orders\/([^\/]+)\/status$/', $path, $matches)) {
    $order_id = $matches[1];
    $input = getJsonInput();
    $orders = json_decode(file_get_contents($db_file), true);
    
    $found = false;
    foreach ($orders as &$order) {
        if ($order['id'] === $order_id) {
            $order['status'] = $input['status'];
            array_unshift($order['notifications'], "Order status updated to " . $input['status'] . " at " . date('H:i:s'));
            $found = true;
            $updated_order = $order;
            break;
        }
    }
    
    if ($found) {
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        echo json_encode($updated_order);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
    }
    exit();
}

// Route: orders/:id/notifications
if (preg_match('/^orders\/([^\/]+)\/notifications$/', $path, $matches)) {
    $order_id = $matches[1];
    $input = getJsonInput();
    $orders = json_decode(file_get_contents($db_file), true);
    
    $found = false;
    foreach ($orders as &$order) {
        if ($order['id'] === $order_id) {
            array_unshift($order['notifications'], $input['message']);
            $found = true;
            $updated_order = $order;
            break;
        }
    }
    
    if ($found) {
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        echo json_encode($updated_order);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
    }
    exit();
}

// Route: orders/:id/note (PATCH)
if (preg_match('/^orders\/([^\/]+)\/note$/', $path, $matches)) {
    $order_id = $matches[1];
    $input = getJsonInput();
    $orders = json_decode(file_get_contents($db_file), true);
    
    $found = false;
    foreach ($orders as &$order) {
        if ($order['id'] === $order_id) {
            $note = isset($input['note']) ? $input['note'] : '';
            array_unshift($order['notifications'], "📝 Note: \"" . substr($note, 0, 80) . "\"");
            $found = true;
            $updated_order = $order;
            break;
        }
    }
    
    if ($found) {
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        echo json_encode($updated_order);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
    }
    exit();
}

// Route: orders/:id (DELETE)
if (preg_match('/^orders\/([^\/]+)$/', $path, $matches) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $order_id = $matches[1];
    $orders = json_decode(file_get_contents($db_file), true);
    
    $found = false;
    foreach ($orders as $key => $order) {
        if ($order['id'] === $order_id) {
            // Clean up uploaded file if exists
            $upload_url = '';
            if (isset($order['details']['fileUrl']) && $order['details']['fileUrl']) {
                $upload_url = $order['details']['fileUrl'];
            } elseif (isset($order['details']['logoUrl']) && $order['details']['logoUrl']) {
                $upload_url = $order['details']['logoUrl'];
            }

            if ($upload_url) {
                $file_path = __DIR__ . $upload_url;
                if (file_exists($file_path)) {
                    @unlink($file_path);
                }
            }
            unset($orders[$key]);
            $orders = array_values($orders);
            $found = true;
            break;
        }
    }
    
    if ($found) {
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        http_response_code(200);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
    }
    exit();
}

// Route: uploads (GET - list uploaded graphics)
if ($path === 'uploads' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $upload_dir = __DIR__ . '/uploads/';
    $image_exts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    $files = [];

    if (is_dir($upload_dir)) {
        foreach (scandir($upload_dir) as $filename) {
            if ($filename === '.' || $filename === '..') {
                continue;
            }

            $file_path = $upload_dir . $filename;
            if (!is_file($file_path)) {
                continue;
            }

            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            $files[] = [
                "filename" => $filename,
                "size" => filesize($file_path),
                "sizeKB" => round(filesize($file_path) / 1024),
                "url" => "/uploads/" . $filename,
                "type" => in_array($ext, $image_exts) ? "image/" . $ext : "application/octet-stream",
                "uploadedAt" => date(DATE_ISO8601, filemtime($file_path))
            ];
        }
    }

    echo json_encode($files);
    exit();
}

// Route: uploads/:filename (DELETE - remove uploaded graphic)
if (preg_match('/^uploads\/([^\/]+)$/', $path, $matches) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $filename = basename($matches[1]);
    $file_path = __DIR__ . '/uploads/' . $filename;

    if (!file_exists($file_path)) {
        http_response_code(404);
        echo json_encode(["error" => "File not found"]);
        exit();
    }

    if (@unlink($file_path)) {
        echo json_encode(["success" => true, "message" => "File " . $filename . " deleted"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete file"]);
    }
    exit();
}

// Route: upload (POST - multipart file upload)
if ($path === 'upload' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $upload_dir = __DIR__ . '/uploads/';
    
    // Create uploads directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['png', 'jpg', 'jpeg', 'pdf', 'ai', 'svg', 'gif', 'webp'];
        
        if (!in_array($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(["error" => "File type not allowed"]);
            exit();
        }
        
        if ($file['size'] > 25 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(["error" => "File exceeds 25MB limit"]);
            exit();
        }
        
        // Generate unique filename
        $new_name = bin2hex(random_bytes(12)) . '.' . $ext;
        $target = $upload_dir . $new_name;
        
        if (move_uploaded_file($file['tmp_name'], $target)) {
            echo json_encode([
                "url" => "/uploads/" . $new_name,
                "name" => $file['name'],
                "type" => $file['type']
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save uploaded file"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "No file uploaded or upload error"]);
    }
    exit();
}

// Route: portfolio
if ($path === 'portfolio') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode(readJsonFile($portfolio_file));
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireAdmin();
        $input = getJsonInput();
        $items = readJsonFile($portfolio_file);
        if (!isset($input['title']) || !is_string($input['title']) || trim($input['title']) === '') {
            http_response_code(400);
            echo json_encode(["error" => "title is required"]);
            exit();
        }
        $base_id = (isset($input['id']) && trim($input['id']) !== '') ? slugify($input['id']) : slugify($input['title']);
        foreach ($items as $it) {
            if (isset($it['id']) && $it['id'] === $base_id) {
                http_response_code(400);
                echo json_encode(["error" => "Portfolio item id already exists"]);
                exit();
            }
        }
        $new_item = [
            "id" => $base_id,
            "title" => trim($input['title']),
            "description" => isset($input['description']) ? $input['description'] : '',
            "imageUrl" => isset($input['imageUrl']) && $input['imageUrl'] ? $input['imageUrl'] : null,
            "link" => isset($input['link']) ? $input['link'] : '',
            "category" => isset($input['category']) ? $input['category'] : '',
            "order" => isset($input['order']) && is_numeric($input['order']) ? intval($input['order']) : 0,
            "createdAt" => date(DATE_ISO8601)
        ];
        $items[] = $new_item;
        writeJsonFile($portfolio_file, $items);
        http_response_code(201);
        echo json_encode($new_item);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
    exit();
}

// Route: portfolio/:id
if (preg_match('/^portfolio\/([^\/]+)$/', $path, $matches)) {
    $item_id = $matches[1];
    $items = readJsonFile($portfolio_file);
    $idx = -1;
    foreach ($items as $i => $it) {
        if (isset($it['id']) && $it['id'] === $item_id) { $idx = $i; break; }
    }
    if ($idx === -1) {
        http_response_code(404);
        echo json_encode(["error" => "Portfolio item not found"]);
        exit();
    }
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        requireAdmin();
        $input = getJsonInput();
        $item = $items[$idx];
        if (array_key_exists('title', $input)) $item['title'] = $input['title'];
        if (array_key_exists('description', $input)) $item['description'] = $input['description'];
        if (array_key_exists('imageUrl', $input)) $item['imageUrl'] = $input['imageUrl'] ? $input['imageUrl'] : null;
        if (array_key_exists('link', $input)) $item['link'] = $input['link'];
        if (array_key_exists('category', $input)) $item['category'] = $input['category'];
        if (array_key_exists('order', $input)) $item['order'] = is_numeric($input['order']) ? intval($input['order']) : $item['order'];
        $items[$idx] = $item;
        writeJsonFile($portfolio_file, $items);
        echo json_encode($item);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        requireAdmin();
        $removed = $items[$idx];
        if (isset($removed['imageUrl']) && $removed['imageUrl']) {
            $fp = __DIR__ . $removed['imageUrl'];
            if (file_exists($fp)) @unlink($fp);
        }
        array_splice($items, $idx, 1);
        writeJsonFile($portfolio_file, $items);
        echo json_encode(["success" => true, "message" => "Portfolio item " . $item_id . " deleted"]);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
    exit();
}

// Route: blog
if ($path === 'blog') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $posts = readJsonFile($blog_file);
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        if ($status === 'published') {
            $filtered = [];
            foreach ($posts as $p) {
                if (isset($p['status']) && $p['status'] === 'published') $filtered[] = $p;
            }
            echo json_encode($filtered);
        } else {
            echo json_encode($posts);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireAdmin();
        $input = getJsonInput();
        $posts = readJsonFile($blog_file);
        if (!isset($input['title']) || !is_string($input['title']) || trim($input['title']) === '') {
            http_response_code(400);
            echo json_encode(["error" => "title is required"]);
            exit();
        }
        if (!isset($input['content']) || !is_string($input['content']) || trim($input['content']) === '') {
            http_response_code(400);
            echo json_encode(["error" => "content is required"]);
            exit();
        }
        $base = (isset($input['slug']) && trim($input['slug']) !== '') ? slugify($input['slug']) : slugify($input['title']);
        $final = $base;
        $n = 2;
        $taken = false;
        do {
            $taken = false;
            foreach ($posts as $p) {
                if (isset($p['slug']) && $p['slug'] === $final) { $taken = true; break; }
            }
            if ($taken) { $final = $base . '-' . $n; $n++; }
        } while ($taken);
        $new_post = [
            "id" => "blog-" . time(),
            "slug" => $final,
            "title" => trim($input['title']),
            "excerpt" => isset($input['excerpt']) ? $input['excerpt'] : '',
            "content" => $input['content'],
            "coverImageUrl" => isset($input['coverImageUrl']) && $input['coverImageUrl'] ? $input['coverImageUrl'] : null,
            "author" => isset($input['author']) ? $input['author'] : '',
            "tags" => isset($input['tags']) && is_array($input['tags']) ? $input['tags'] : [],
            "status" => (isset($input['status']) && $input['status'] === 'published') ? 'published' : 'draft',
            "createdAt" => date(DATE_ISO8601),
            "updatedAt" => date(DATE_ISO8601)
        ];
        $posts[] = $new_post;
        writeJsonFile($blog_file, $posts);
        http_response_code(201);
        echo json_encode($new_post);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
    exit();
}

// Route: blog/:slug (GET) and blog/:id (PUT/DELETE)
if (preg_match('/^blog\/([^\/]+)$/', $path, $matches)) {
    $segment = $matches[1];
    $posts = readJsonFile($blog_file);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $found = null;
        foreach ($posts as $p) {
            if (isset($p['slug']) && $p['slug'] === $segment && isset($p['status']) && $p['status'] === 'published') { $found = $p; break; }
        }
        if ($found === null) {
            http_response_code(404);
            echo json_encode(["error" => "Post not found"]);
            exit();
        }
        echo json_encode($found);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        requireAdmin();
        $input = getJsonInput();
        $idx = -1;
        foreach ($posts as $i => $p) {
            if (isset($p['id']) && $p['id'] === $segment) { $idx = $i; break; }
        }
        if ($idx === -1) {
            http_response_code(404);
            echo json_encode(["error" => "Post not found"]);
            exit();
        }
        $post = $posts[$idx];
        $resolveSlug = function($source) use ($posts, $segment) {
            $base = slugify($source);
            $candidate = $base;
            $n = 2;
            foreach ($posts as $p) {
                if (isset($p['slug']) && $p['slug'] === $candidate && $p['id'] !== $segment) { $candidate = $base . '-' . $n; $n++; }
            }
            return $candidate;
        };
        if (array_key_exists('slug', $input) && is_string($input['slug']) && trim($input['slug']) !== '') {
            $post['slug'] = $resolveSlug($input['slug']);
        } elseif (array_key_exists('title', $input) && $input['title'] !== $post['title']) {
            $post['slug'] = $resolveSlug($input['title']);
        }
        if (array_key_exists('title', $input)) $post['title'] = $input['title'];
        if (array_key_exists('content', $input)) $post['content'] = $input['content'];
        if (array_key_exists('excerpt', $input)) $post['excerpt'] = $input['excerpt'];
        if (array_key_exists('coverImageUrl', $input)) $post['coverImageUrl'] = $input['coverImageUrl'] ? $input['coverImageUrl'] : null;
        if (array_key_exists('author', $input)) $post['author'] = $input['author'];
        if (array_key_exists('tags', $input)) $post['tags'] = is_array($input['tags']) ? $input['tags'] : [];
        if (array_key_exists('status', $input)) $post['status'] = $input['status'];
        $post['updatedAt'] = date(DATE_ISO8601);
        $posts[$idx] = $post;
        writeJsonFile($blog_file, $posts);
        echo json_encode($post);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        requireAdmin();
        $idx = -1;
        foreach ($posts as $i => $p) {
            if (isset($p['id']) && $p['id'] === $segment) { $idx = $i; break; }
        }
        if ($idx === -1) {
            http_response_code(404);
            echo json_encode(["error" => "Post not found"]);
            exit();
        }
        $removed = $posts[$idx];
        if (isset($removed['coverImageUrl']) && $removed['coverImageUrl']) {
            $fp = __DIR__ . $removed['coverImageUrl'];
            if (file_exists($fp)) @unlink($fp);
        }
        array_splice($posts, $idx, 1);
        writeJsonFile($blog_file, $posts);
        echo json_encode(["success" => true, "message" => "Post " . $segment . " deleted"]);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
    exit();
}

// Route: site-info
if ($path === 'site-info') {
    $default_site_info = [
        "phone" => "",
        "email" => "",
        "address" => "",
        "openingHours" => "",
        "closingHours" => "",
        "socials" => ["x" => "", "tiktok" => "", "instagram" => "", "linkedin" => ""],
        "brandTagline" => ""
    ];
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode(readJsonFileRaw($site_info_file, $default_site_info));
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        requireAdmin();
        $input = getJsonInput() ?: [];
        $current = readJsonFileRaw($site_info_file, $default_site_info);
        $fields = ['phone', 'email', 'address', 'openingHours', 'closingHours', 'brandTagline'];
        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) $current[$f] = $input[$f];
        }
        $socials = (isset($current['socials']) && is_array($current['socials'])) ? $current['socials'] : [];
        $social_keys = ['x', 'tiktok', 'instagram', 'linkedin'];
        foreach ($social_keys as $s) {
            if (isset($input['socials']) && is_array($input['socials']) && array_key_exists($s, $input['socials'])) {
                $socials[$s] = $input['socials'][$s];
            }
        }
        $current['socials'] = $socials;
        writeJsonFile($site_info_file, $current);
        echo json_encode($current);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
    exit();
}

// Route: content (generic editable frontend copy)
if ($path === 'content') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode(readJsonFileRaw($content_file, []));
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        requireAdmin();
        $input = getJsonInput() ?: [];
        $current = readJsonFileRaw($content_file, []);
        $merged = deepMergeContent($current, $input);
        writeJsonFile($content_file, $merged);
        echo json_encode($merged);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
    exit();
}

// Fallback error
http_response_code(404);
echo json_encode(["error" => "Endpoint not found"]);
?>
