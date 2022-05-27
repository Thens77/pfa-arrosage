package com.iir4.emsi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iir4.emsi.IntegrationTest;
import com.iir4.emsi.domain.Boitier;
import com.iir4.emsi.repository.BoitierRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BoitierResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BoitierResourceIT {

    private static final String DEFAULT_REFRENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFRENCE = "BBBBBBBBBB";

    private static final Integer DEFAULT_NBR_BRANCHE = 1;
    private static final Integer UPDATED_NBR_BRANCHE = 2;

    private static final String ENTITY_API_URL = "/api/boitiers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BoitierRepository boitierRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBoitierMockMvc;

    private Boitier boitier;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Boitier createEntity(EntityManager em) {
        Boitier boitier = new Boitier().refrence(DEFAULT_REFRENCE).nbrBranche(DEFAULT_NBR_BRANCHE);
        return boitier;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Boitier createUpdatedEntity(EntityManager em) {
        Boitier boitier = new Boitier().refrence(UPDATED_REFRENCE).nbrBranche(UPDATED_NBR_BRANCHE);
        return boitier;
    }

    @BeforeEach
    public void initTest() {
        boitier = createEntity(em);
    }

    @Test
    @Transactional
    void createBoitier() throws Exception {
        int databaseSizeBeforeCreate = boitierRepository.findAll().size();
        // Create the Boitier
        restBoitierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitier)))
            .andExpect(status().isCreated());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeCreate + 1);
        Boitier testBoitier = boitierList.get(boitierList.size() - 1);
        assertThat(testBoitier.getRefrence()).isEqualTo(DEFAULT_REFRENCE);
        assertThat(testBoitier.getNbrBranche()).isEqualTo(DEFAULT_NBR_BRANCHE);
    }

    @Test
    @Transactional
    void createBoitierWithExistingId() throws Exception {
        // Create the Boitier with an existing ID
        boitier.setId(1L);

        int databaseSizeBeforeCreate = boitierRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBoitierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitier)))
            .andExpect(status().isBadRequest());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBoitiers() throws Exception {
        // Initialize the database
        boitierRepository.saveAndFlush(boitier);

        // Get all the boitierList
        restBoitierMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(boitier.getId().intValue())))
            .andExpect(jsonPath("$.[*].refrence").value(hasItem(DEFAULT_REFRENCE)))
            .andExpect(jsonPath("$.[*].nbrBranche").value(hasItem(DEFAULT_NBR_BRANCHE)));
    }

    @Test
    @Transactional
    void getBoitier() throws Exception {
        // Initialize the database
        boitierRepository.saveAndFlush(boitier);

        // Get the boitier
        restBoitierMockMvc
            .perform(get(ENTITY_API_URL_ID, boitier.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(boitier.getId().intValue()))
            .andExpect(jsonPath("$.refrence").value(DEFAULT_REFRENCE))
            .andExpect(jsonPath("$.nbrBranche").value(DEFAULT_NBR_BRANCHE));
    }

    @Test
    @Transactional
    void getNonExistingBoitier() throws Exception {
        // Get the boitier
        restBoitierMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBoitier() throws Exception {
        // Initialize the database
        boitierRepository.saveAndFlush(boitier);

        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();

        // Update the boitier
        Boitier updatedBoitier = boitierRepository.findById(boitier.getId()).get();
        // Disconnect from session so that the updates on updatedBoitier are not directly saved in db
        em.detach(updatedBoitier);
        updatedBoitier.refrence(UPDATED_REFRENCE).nbrBranche(UPDATED_NBR_BRANCHE);

        restBoitierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBoitier.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBoitier))
            )
            .andExpect(status().isOk());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
        Boitier testBoitier = boitierList.get(boitierList.size() - 1);
        assertThat(testBoitier.getRefrence()).isEqualTo(UPDATED_REFRENCE);
        assertThat(testBoitier.getNbrBranche()).isEqualTo(UPDATED_NBR_BRANCHE);
    }

    @Test
    @Transactional
    void putNonExistingBoitier() throws Exception {
        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();
        boitier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoitierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, boitier.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boitier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBoitier() throws Exception {
        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();
        boitier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boitier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBoitier() throws Exception {
        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();
        boitier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBoitierWithPatch() throws Exception {
        // Initialize the database
        boitierRepository.saveAndFlush(boitier);

        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();

        // Update the boitier using partial update
        Boitier partialUpdatedBoitier = new Boitier();
        partialUpdatedBoitier.setId(boitier.getId());

        partialUpdatedBoitier.nbrBranche(UPDATED_NBR_BRANCHE);

        restBoitierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoitier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoitier))
            )
            .andExpect(status().isOk());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
        Boitier testBoitier = boitierList.get(boitierList.size() - 1);
        assertThat(testBoitier.getRefrence()).isEqualTo(DEFAULT_REFRENCE);
        assertThat(testBoitier.getNbrBranche()).isEqualTo(UPDATED_NBR_BRANCHE);
    }

    @Test
    @Transactional
    void fullUpdateBoitierWithPatch() throws Exception {
        // Initialize the database
        boitierRepository.saveAndFlush(boitier);

        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();

        // Update the boitier using partial update
        Boitier partialUpdatedBoitier = new Boitier();
        partialUpdatedBoitier.setId(boitier.getId());

        partialUpdatedBoitier.refrence(UPDATED_REFRENCE).nbrBranche(UPDATED_NBR_BRANCHE);

        restBoitierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoitier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoitier))
            )
            .andExpect(status().isOk());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
        Boitier testBoitier = boitierList.get(boitierList.size() - 1);
        assertThat(testBoitier.getRefrence()).isEqualTo(UPDATED_REFRENCE);
        assertThat(testBoitier.getNbrBranche()).isEqualTo(UPDATED_NBR_BRANCHE);
    }

    @Test
    @Transactional
    void patchNonExistingBoitier() throws Exception {
        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();
        boitier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoitierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, boitier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boitier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBoitier() throws Exception {
        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();
        boitier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boitier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBoitier() throws Exception {
        int databaseSizeBeforeUpdate = boitierRepository.findAll().size();
        boitier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(boitier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Boitier in the database
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBoitier() throws Exception {
        // Initialize the database
        boitierRepository.saveAndFlush(boitier);

        int databaseSizeBeforeDelete = boitierRepository.findAll().size();

        // Delete the boitier
        restBoitierMockMvc
            .perform(delete(ENTITY_API_URL_ID, boitier.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Boitier> boitierList = boitierRepository.findAll();
        assertThat(boitierList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
