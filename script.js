document.addEventListener("DOMContentLoaded", () => {
    const botaoMenu = document.querySelector(".menu-mobile");
    const menu = document.querySelector(".menu");

    const busca = document.getElementById("busca-site");
    if (busca) {
        const resultados = document.getElementById("resultados-busca");
        const normalizar = (texto) => texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

        busca.hidden = false;
        busca.addEventListener("submit", (evento) => {
            evento.preventDefault();
            const termos = normalizar(busca.elements.q.value.trim()).split(/\s+/);
            resultados.replaceChildren();

            for (const secao of document.querySelectorAll("main section[id]")) {
                if (!termos.every((termo) => termo && normalizar(secao.textContent).includes(termo))) {
                    continue;
                }

                const titulo = secao.querySelector("h2");
                if (!titulo) continue;

                const link = document.createElement("a");
                link.href = "#" + secao.id;
                link.textContent = titulo.textContent.trim();
                link.addEventListener("click", (clique) => {
                    clique.preventDefault();
                    resultados.hidden = true;
                    const cabecalho = busca.closest(".cabecalho");
                    const topo = secao.getBoundingClientRect().top + window.scrollY - cabecalho.offsetHeight - 12;
                    window.scrollTo({ top: topo, behavior: "smooth" });
                });
                resultados.append(link);
            }

            if (!resultados.childElementCount) {
                resultados.textContent = "Nenhuma seção encontrada.";
            }
            resultados.hidden = false;
        });

        busca.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") resultados.hidden = true;
        });
        document.addEventListener("click", (evento) => {
            if (!busca.contains(evento.target)) resultados.hidden = true;
        });
    }

    const perguntasFaq = document.querySelectorAll(".faq-pergunta");

    const formularioContato = document.getElementById("formulario-contato");
    formularioContato?.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const dados = new FormData(formularioContato);
        const corpo = [
            "Nome: " + dados.get("nome"),
            "E-mail: " + dados.get("email"),
            "",
            dados.get("mensagem")
        ].join("\r\n");
        window.location.href = formularioContato.action +
            "?subject=Contato%20pelo%20site&body=" + encodeURIComponent(corpo);
    });

    const anoAtual = document.getElementById("ano-atual");


    /* ==========================================================
       ANO ATUAL DO RODAPÉ
    ========================================================== */

    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }


    /* ==========================================================
       MENU MOBILE
    ========================================================== */

    if (botaoMenu && menu) {
        botaoMenu.addEventListener("click", () => {
            const menuEstaAberto = menu.classList.toggle("ativo");

            botaoMenu.classList.toggle("ativo", menuEstaAberto);
            botaoMenu.setAttribute("aria-expanded", String(menuEstaAberto));
        });


        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.remove("ativo");
                botaoMenu.classList.remove("ativo");
                botaoMenu.setAttribute("aria-expanded", "false");
            });
        });


        window.addEventListener("resize", () => {
            if (window.innerWidth > 920) {
                menu.classList.remove("ativo");
                botaoMenu.classList.remove("ativo");
                botaoMenu.setAttribute("aria-expanded", "false");
            }
        });
    }


    /* ==========================================================
       FAQ
    ========================================================== */

    perguntasFaq.forEach((pergunta) => {
        pergunta.addEventListener("click", () => {
            const itemAtual = pergunta.closest(".faq-item");

            if (!itemAtual) {
                return;
            }

            const estavaAberto = itemAtual.classList.contains("ativo");


            perguntasFaq.forEach((outraPergunta) => {
                const outroItem = outraPergunta.closest(".faq-item");

                if (!outroItem) {
                    return;
                }

                outroItem.classList.remove("ativo");
                outraPergunta.setAttribute("aria-expanded", "false");
            });


            if (!estavaAberto) {
                itemAtual.classList.add("ativo");
                pergunta.setAttribute("aria-expanded", "true");
            }
        });
    });


    /* ==========================================================
       EVENTOS DO GOOGLE ANALYTICS 4
    ========================================================== */

    function enviarEventoGA4(nomeDoEvento, parametros = {}) {
        if (typeof window.gtag !== "function") {
            return;
        }

        window.gtag("event", nomeDoEvento, {
            page_location: window.location.href,
            page_title: document.title,
            ...parametros
        });
    }

        function identificarLocalDoClique(elemento) {
        if (elemento.closest(".cabecalho")) {
            return "cabecalho";
        }

        if (elemento.closest(".hero")) {
            return "hero";
        }

        if (elemento.closest("#servicos")) {
            return "servicos";
        }

        if (elemento.closest("#planejamento")) {
            return "planejamento";
        }

        if (elemento.closest("#contato")) {
            return "contato";
        }

        if (elemento.closest(".rodape")) {
            return "rodape";
        }

        if (elemento.closest("#modal-em-breve")) {
            return "modal_em_breve";
        }

        return "outro";
    }

        document.addEventListener("click", (evento) => {
        const link = evento.target.closest("a[href]");

        if (!link) {
            return;
        }

        const href = link.href;
        const textoDoLink = link.textContent.trim().replace(/\s+/g, " ");
        const localDoClique = identificarLocalDoClique(link);

        const parametros = {
            link_text: textoDoLink,
            link_url: href,
            click_location: localDoClique
        };

        if (
            href.includes("wa.me/") ||
            href.includes("api.whatsapp.com/")
        ) {
            enviarEventoGA4("click_whatsapp", parametros);
            return;
        }

        if (
            href.includes("docs.google.com/forms/") ||
            href.includes("forms.gle/")
        ) {
            enviarEventoGA4("planning_form_open", parametros);
            return;
        }

        if (href.startsWith("mailto:")) {
            enviarEventoGA4("click_email", parametros);
            return;
        }

        if (href.startsWith("tel:")) {
            enviarEventoGA4("click_phone", parametros);
            return;
        }

        if (href.includes("instagram.com/")) {
            enviarEventoGA4("click_instagram", parametros);
            return;
        }

        if (
            href.includes("google.com/maps") ||
            href.includes("maps.app.goo.gl")
        ) {
            enviarEventoGA4("click_maps", parametros);
        }
    });

        linksEmBreve.forEach((link) => {
        link.addEventListener("click", () => {
            enviarEventoGA4("service_interest_unavailable", {
                service_name:
                    link.getAttribute("data-servico") ||
                    "Serviço não identificado",
                link_text: link.textContent.trim().replace(/\s+/g, " "),
                click_location: "servicos"
            });
        });
    });
    /* ==========================================================
       ROLAGEM SUAVE NOS LINKS INTERNOS
    ========================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (evento) => {
            const destinoId = link.getAttribute("href");

            if (
                !destinoId ||
                destinoId === "#"
            ) {
                return;
            }

            const destino = document.querySelector(destinoId);

            if (!destino) {
                return;
            }

            evento.preventDefault();

            const alturaCabecalho =
                document.querySelector(".cabecalho")?.offsetHeight || 0;

            const posicaoDestino =
                destino.getBoundingClientRect().top +
                window.scrollY -
                alturaCabecalho -
                12;

            window.scrollTo({
                top: posicaoDestino,
                behavior: "smooth"
            });
        });
    });
});
