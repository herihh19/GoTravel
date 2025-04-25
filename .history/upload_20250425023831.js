import streamlit as st
import google.generativeai as genai
from PIL import Image
import os # Para lidar com variáveis de ambiente (opcional, mas recomendado)

# --- Configuração da API Key do Google AI ---
# É MAIS SEGURO usar segredos do Streamlit ou variáveis de ambiente
# NUNCA coloque sua chave de API diretamente no código em produção!

# Tenta obter a chave da API das secrets do Streamlit (ideal para deploy)
try:
    GOOGLE_API_KEY = st.secrets["GOOGLE_API_KEY"]
# Se não encontrar, tenta obter de uma variável de ambiente (bom para desenvolvimento local)
except KeyError:
    try:
        GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]
    # Se ainda não encontrar, pede ao usuário (MENOS SEGURO, apenas para teste rápido)
    except KeyError:
        st.warning("🔑 Chave da API do Google não encontrada nas secrets ou variáveis de ambiente.")
        GOOGLE_API_KEY = st.text_input("Insira sua Google API Key:", type="password")

# Se a chave não foi fornecida de nenhuma forma, para a execução
if not GOOGLE_API_KEY:
    st.error("A Chave da API do Google é necessária para executar o aplicativo.")
    st.stop()

# Configura a biblioteca do Google AI com a chave
try:
    genai.configure(api_key=GOOGLE_API_KEY)
except Exception as e:
    st.error(f"Erro ao configurar a API do Google: {e}")
    st.stop()

# --- Configuração do Modelo Generativo ---
# Escolha um modelo que suporte visão (multimodal)
# 'gemini-1.5-flash-latest' é uma boa opção rápida e capaz
# 'gemini-pro-vision' era o modelo anterior comum para isso
try:
    model = genai.GenerativeModel('gemini-1.5-flash-latest') # Ou 'gemini-pro-vision'
except Exception as e:
    st.error(f"Erro ao carregar o modelo Generativo: {e}")
    st.stop()


# --- Interface do Usuário com Streamlit ---
st.title("🤖 Chatbot de Agência de Turismo")
st.subheader("Identificador de Locais por Imagem 📸")
st.write("Faça o upload de uma imagem de um ponto turístico e eu tentarei identificar onde é!")

# Componente para fazer upload de arquivo
uploaded_file = st.file_uploader("Escolha uma imagem...", type=["jpg", "jpeg", "png"])

image = None # Variável para guardar a imagem aberta

if uploaded_file is not None:
    # Abre a imagem usando a biblioteca Pillow (PIL)
    image = Image.open(uploaded_file)

    # Mostra a imagem na tela
    st.image(image, caption='Imagem Carregada.', use_column_width=True)

    # Botão para iniciar a análise
    if st.button("🔍 Identificar Local na Imagem"):
        with st.spinner("Analisando a imagem... Por favor, aguarde."): # Mostra uma mensagem de 'carregando'
            try:
                # Prepara o prompt para o modelo multimodal
                # Enviamos o texto da pergunta E a imagem
                prompt_parts = [
                    "Que local é mostrado nesta imagem? Seja específico sobre o nome do ponto turístico, cidade e país, se possível. Responda em português.",
                    image, # O objeto Image do Pillow
                ]

                # Chama a API do Google Generative AI
                response = model.generate_content(prompt_parts)

                # Mostra a resposta
                st.success("Análise Concluída!")
                st.markdown("---") # Linha divisória
                st.subheader("Resultado da Análise:")
                st.write(response.text)

            except Exception as e:
                st.error(f"😥 Ocorreu um erro durante a análise:")
                st.error(e)
                # Você pode querer adicionar mais detalhes do erro para debugging
                # st.exception(e)

# Mensagem se o botão for clicado sem imagem
elif st.button("🔍 Identificar Local na Imagem"):
     st.warning("Por favor, carregue uma imagem primeiro.")