package com.smartlibrary.backend.dto;

public class ChatResponse {

    private String reply;
    private String model;
    private boolean fallback;

    public ChatResponse() {
    }

    public ChatResponse(String reply, String model, boolean fallback) {
        this.reply = reply;
        this.model = model;
        this.fallback = fallback;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public boolean isFallback() {
        return fallback;
    }

    public void setFallback(boolean fallback) {
        this.fallback = fallback;
    }
}
