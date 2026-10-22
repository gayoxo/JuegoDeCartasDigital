import json
from playwright.sync_api import sync_playwright, expect

BASE_URL = "http://host.docker.internal:4173/"

controlled_deck = {
    "schemaVersion": 1,
    "id": "controlled",
    "name": "Baraja controlada",
    "subtitle": "E2E",
    "cover": "assets/cards/cover.jpg",
    "back": "assets/cards/back.jpg",
    "rulesImage": "assets/cards/instructions.jpg",
    "stats": [
        {"key": "power", "label": "Potencia", "unit": "CV", "direction": "high"},
        {"key": "weight", "label": "Peso", "unit": "kg", "direction": "low"},
    ],
    "cards": [
        {"id": "a", "name": "A", "image": "assets/cards/1a.jpg", "values": {"power": 90, "weight": 5}},
        {"id": "b", "name": "B", "image": "assets/cards/1b.jpg", "values": {"power": 100, "weight": 9}},
        {"id": "c", "name": "C", "image": "assets/cards/1c.jpg", "values": {"power": 10, "weight": 8}},
        {"id": "d", "name": "D", "image": "assets/cards/1d.jpg", "values": {"power": 50, "weight": 7}},
    ],
}

short_deck = {
    **controlled_deck,
    "id": "short-controlled",
    "cards": [controlled_deck["cards"][0], controlled_deck["cards"][1]],
}


def test_real_deck_and_keyboard(browser):
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    origins = set()
    page.on("request", lambda request: origins.add(request.url.split("/", 3)[2]))
    page.goto(BASE_URL)
    expect(page.locator("#deckStatus")).to_contain_text("preparada")
    expect(page.locator("#deckSize")).to_have_text("32")
    expect(page.locator("#startButton")).to_be_enabled()
    page.locator("#rulesButton").focus()
    page.keyboard.press("Enter")
    expect(page.locator("#rulesDialog")).to_be_visible()
    page.keyboard.press("Escape")
    expect(page.locator("#rulesDialog")).not_to_be_visible()
    page.locator("#startButton").focus()
    page.keyboard.press("Enter")
    expect(page.locator("#gameScreen")).to_be_visible()
    assert origins == {"host.docker.internal:4173"}, origins
    page.close()


def test_loading_error(browser):
    page = browser.new_page()
    page.route("**/data/decks/rally-cars.json", lambda route: route.fulfill(status=200, content_type="application/json", body='{"schemaVersion":99}'))
    page.goto(BASE_URL)
    expect(page.locator("#deckStatus")).to_contain_text("No se pudo cargar")
    expect(page.locator("#startButton")).to_be_disabled()
    page.close()


def test_controlled_gameplay_and_rules(browser):
    page = browser.new_page(viewport={"width": 900, "height": 900})
    page.add_init_script("Math.random = () => 0")
    page.route("**/data/decks/rally-cars.json", lambda route: route.fulfill(status=200, content_type="application/json", body=json.dumps(controlled_deck)))
    page.goto(BASE_URL)
    expect(page.locator("#startButton")).to_be_enabled()
    page.locator("#startButton").click()
    expect(page.locator("#turnPill")).to_have_text("Tu turno")
    before = (page.locator("#playerCount").inner_text(), page.locator("#cpuCount").inner_text())
    page.locator("#rulesButton").click()
    expect(page.locator("#rulesDialog")).to_be_visible()
    page.locator("#closeRulesButton").click()
    assert before == (page.locator("#playerCount").inner_text(), page.locator("#cpuCount").inner_text())
    power = page.locator('#playerCard [data-stat="power"]')
    expect(power).to_have_attribute("aria-label", "Potencia: 100 CV")
    power.focus()
    page.keyboard.press("Enter")
    expect(page.locator("#turnPill")).to_have_text("Ganas la mano")
    expect(page.locator("#actionHint")).to_contain_text("Recibes 2 cartas")
    page.locator("#nextButton").click()
    page.locator('#playerCard [data-stat="power"]').click()
    expect(page.locator("#turnPill")).to_have_text("Gana el rival")
    expect(page.locator("#actionHint")).to_contain_text("El rival recibe 2 cartas")
    page.close()


def test_mobile_layout_and_reduced_motion(browser):
    context = browser.new_context(viewport={"width": 320, "height": 780}, reduced_motion="reduce", has_touch=True, is_mobile=True)
    page = context.new_page()
    page.goto(BASE_URL)
    expect(page.locator("#startButton")).to_be_enabled()
    layout = page.evaluate("""() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        offenders: [...document.querySelectorAll('*')].filter(el => {
            const r = el.getBoundingClientRect();
            return r.right > document.documentElement.clientWidth + 1 || r.left < -1;
        }).map(el => `${el.tagName}.${el.className}`).slice(0, 10)
    })""")
    assert layout["scrollWidth"] <= layout["clientWidth"], layout
    transition = page.locator("#startButton").evaluate("el => getComputedStyle(el).transitionDuration")
    assert transition in ("0s", "0.00001s", "1e-05s"), transition
    for selector in ("#startButton", "#rulesButton"):
        box = page.locator(selector).bounding_box()
        assert box["height"] >= 44, (selector, box)
    context.close()


def test_orientation_keeps_current_action_visible(browser):
    context = browser.new_context(viewport={"width": 360, "height": 800}, has_touch=True, is_mobile=True)
    page = context.new_page()
    page.add_init_script("Math.random = () => 0")
    page.route("**/data/decks/rally-cars.json", lambda route: route.fulfill(status=200, content_type="application/json", body=json.dumps(controlled_deck)))
    page.goto(BASE_URL)
    page.locator("#startButton").tap()

    def assert_layout(selector):
        layout = page.evaluate("""selector => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            action: (() => { const r = document.querySelector(selector).getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; })()
        })""", selector)
        assert layout["scrollWidth"] <= layout["clientWidth"], layout
        assert layout["action"]["left"] >= -1 and layout["action"]["right"] <= layout["clientWidth"] + 1, layout

    assert_layout('#playerCard .stat-button:not([disabled])')
    page.set_viewport_size({"width": 800, "height": 360})
    assert_layout('#playerCard .stat-button:not([disabled])')
    page.locator('#playerCard .stat-button:not([disabled])').first.tap()
    assert_layout("#nextButton")
    page.set_viewport_size({"width": 360, "height": 800})
    assert_layout("#nextButton")
    context.close()


def test_keyboard_finish_and_restart(browser):
    page = browser.new_page(viewport={"width": 900, "height": 900})
    page.add_init_script("Math.random = () => 0")
    page.route("**/data/decks/rally-cars.json", lambda route: route.fulfill(status=200, content_type="application/json", body=json.dumps(short_deck)))
    page.goto(BASE_URL)
    expect(page.locator("#startButton")).to_be_enabled()
    page.locator("#startButton").focus()
    page.keyboard.press("Enter")
    page.locator('#playerCard [data-stat="power"]').focus()
    page.keyboard.press("Enter")
    expect(page.locator("#nextButton")).to_have_text("Ver resultado →")
    page.locator("#nextButton").focus()
    page.keyboard.press("Enter")
    expect(page.locator("#endDialog")).to_be_visible()
    page.locator("#restartButton").focus()
    page.keyboard.press("Enter")
    expect(page.locator("#endDialog")).not_to_be_visible()
    expect(page.locator("#gameScreen")).to_be_visible()
    page.close()


def test_game_restores_and_discards_invalid_snapshot(browser):
    context = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    page = context.new_page()
    page.add_init_script("Math.random = () => 0")
    page.route("**/data/decks/rally-cars.json", lambda route: route.fulfill(status=200, content_type="application/json", body=json.dumps(controlled_deck)))
    page.goto(BASE_URL)
    page.locator("#startButton").tap()
    page.locator('#playerCard [data-stat="power"]').tap()
    before = (page.locator("#playerCount").inner_text(), page.locator("#cpuCount").inner_text(), page.locator("#turnPill").inner_text())
    page.reload()
    expect(page.locator("#gameScreen")).to_be_visible()
    assert before == (page.locator("#playerCount").inner_text(), page.locator("#cpuCount").inner_text(), page.locator("#turnPill").inner_text())
    page.add_init_script("localStorage.setItem('baraja-rally.game.v1', '{broken')")
    page.reload()
    expect(page.locator("#startScreen")).to_be_visible()
    expect(page.locator("#deckStatus")).to_contain_text("No se pudo recuperar")
    expect(page.locator("#startButton")).to_be_enabled()
    context.close()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    try:
        test_real_deck_and_keyboard(browser)
        test_loading_error(browser)
        test_controlled_gameplay_and_rules(browser)
        test_mobile_layout_and_reduced_motion(browser)
        test_orientation_keeps_current_action_visible(browser)
        test_keyboard_finish_and_restart(browser)
        test_game_restores_and_discards_invalid_snapshot(browser)
        print("E2E: 7 scenarios passed")
    finally:
        browser.close()
