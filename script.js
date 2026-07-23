document.addEventListener("DOMContentLoaded", () => {
    const botaoMenu = document.querySelector(".menu-mobile");
    const menu = document.querySelector(".menu");

    const perguntasFaq = document.querySelectorAll(".faq-pergunta");

    const linksEmBreve = document.querySelectorAll("[data-em-breve]");
    const modal = document.getElementById("modal-em-breve");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalTexto = document.getElementById("modal-texto");
    const botoesFecharModal = document.querySelectorAll("[data-fechar-modal]");

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
       MODAL DAS PÁGINAS EM CONSTRUÇÃO
    ========================================================== */

    let elementoFocadoAntesDoModal = null;


    function abrirModal(servico) {
        if (!modal) {
            return;
        }

        elementoFocadoAntesDoModal = document.activeElement;

        if (modalTitulo) {
            modalTitulo.textContent = `${servico}: página em construção`;
        }

        if (modalTexto) {
            modalTexto.textContent =
                "Estamos preparando um conteúdo completo sobre este serviço. " +
                "A página será publicada assim que estiver pronta.";
        }

        modal.classList.add("ativo");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-aberto");

        const primeiroBotao = modal.querySelector(
            "button, a, [tabindex]:not([tabindex='-1'])"
        );

        if (primeiroBotao) {
            primeiroBotao.focus();
        }
    }


    function fecharModal() {
        if (!modal) {
            return;
        }

        modal.classList.remove("ativo");
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-aberto");

        if (
            elementoFocadoAntesDoModal &&
            typeof elementoFocadoAntesDoModal.focus === "function"
        ) {
            elementoFocadoAntesDoModal.focus();
        }
    }


    linksEmBreve.forEach((link) => {
        link.addEventListener("click", (evento) => {
            evento.preventDefault();

            const servico =
                link.getAttribute("data-servico") ||
                "Este serviço";

            abrirModal(servico);
        });
    });


    botoesFecharModal.forEach((botao) => {
        botao.addEventListener("click", fecharModal);
    });


    document.addEventListener("keydown", (evento) => {
        if (
            evento.key === "Escape" &&
            modal &&
            modal.classList.contains("ativo")
        ) {
            fecharModal();
        }
    });


    if (modal) {
        modal.addEventListener("keydown", (evento) => {
            if (evento.key !== "Tab") {
                return;
            }

            const elementosFocaveis = Array.from(
                modal.querySelectorAll(
                    "button:not([disabled]), " +
                    "a[href], " +
                    "input:not([disabled]), " +
                    "select:not([disabled]), " +
                    "textarea:not([disabled]), " +
                    "[tabindex]:not([tabindex='-1'])"
                )
            ).filter((elemento) => {
                return elemento.offsetParent !== null;
            });

            if (elementosFocaveis.length === 0) {
                return;
            }

            const primeiroElemento = elementosFocaveis[0];
            const ultimoElemento =
                elementosFocaveis[elementosFocaveis.length - 1];


            if (
                evento.shiftKey &&
                document.activeElement === primeiroElemento
            ) {
                evento.preventDefault();
                ultimoElemento.focus();
            } else if (
                !evento.shiftKey &&
                document.activeElement === ultimoElemento
            ) {
                evento.preventDefault();
                primeiroElemento.focus();
            }
        });
    }


    /* ==========================================================
       ROLAGEM SUAVE NOS LINKS INTERNOS
    ========================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (evento) => {
            const destinoId = link.getAttribute("href");

            if (
                !destinoId ||
                destinoId === "#" ||
                link.hasAttribute("data-em-breve")
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