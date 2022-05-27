package com.iir4.emsi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iir4.emsi.IntegrationTest;
import com.iir4.emsi.domain.Grandeur;
import com.iir4.emsi.repository.GrandeurRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link GrandeurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GrandeurResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_VALEUR = "AAAAAAAAAA";
    private static final String UPDATED_VALEUR = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/grandeurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GrandeurRepository grandeurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGrandeurMockMvc;

    private Grandeur grandeur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grandeur createEntity(EntityManager em) {
        Grandeur grandeur = new Grandeur().type(DEFAULT_TYPE).valeur(DEFAULT_VALEUR).date(DEFAULT_DATE);
        return grandeur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grandeur createUpdatedEntity(EntityManager em) {
        Grandeur grandeur = new Grandeur().type(UPDATED_TYPE).valeur(UPDATED_VALEUR).date(UPDATED_DATE);
        return grandeur;
    }

    @BeforeEach
    public void initTest() {
        grandeur = createEntity(em);
    }

    @Test
    @Transactional
    void createGrandeur() throws Exception {
        int databaseSizeBeforeCreate = grandeurRepository.findAll().size();
        // Create the Grandeur
        restGrandeurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grandeur)))
            .andExpect(status().isCreated());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeCreate + 1);
        Grandeur testGrandeur = grandeurList.get(grandeurList.size() - 1);
        assertThat(testGrandeur.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testGrandeur.getValeur()).isEqualTo(DEFAULT_VALEUR);
        assertThat(testGrandeur.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createGrandeurWithExistingId() throws Exception {
        // Create the Grandeur with an existing ID
        grandeur.setId(1L);

        int databaseSizeBeforeCreate = grandeurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGrandeurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grandeur)))
            .andExpect(status().isBadRequest());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGrandeurs() throws Exception {
        // Initialize the database
        grandeurRepository.saveAndFlush(grandeur);

        // Get all the grandeurList
        restGrandeurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grandeur.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].valeur").value(hasItem(DEFAULT_VALEUR)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getGrandeur() throws Exception {
        // Initialize the database
        grandeurRepository.saveAndFlush(grandeur);

        // Get the grandeur
        restGrandeurMockMvc
            .perform(get(ENTITY_API_URL_ID, grandeur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grandeur.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.valeur").value(DEFAULT_VALEUR))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingGrandeur() throws Exception {
        // Get the grandeur
        restGrandeurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGrandeur() throws Exception {
        // Initialize the database
        grandeurRepository.saveAndFlush(grandeur);

        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();

        // Update the grandeur
        Grandeur updatedGrandeur = grandeurRepository.findById(grandeur.getId()).get();
        // Disconnect from session so that the updates on updatedGrandeur are not directly saved in db
        em.detach(updatedGrandeur);
        updatedGrandeur.type(UPDATED_TYPE).valeur(UPDATED_VALEUR).date(UPDATED_DATE);

        restGrandeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrandeur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrandeur))
            )
            .andExpect(status().isOk());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
        Grandeur testGrandeur = grandeurList.get(grandeurList.size() - 1);
        assertThat(testGrandeur.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testGrandeur.getValeur()).isEqualTo(UPDATED_VALEUR);
        assertThat(testGrandeur.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingGrandeur() throws Exception {
        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();
        grandeur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrandeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grandeur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grandeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrandeur() throws Exception {
        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();
        grandeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrandeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grandeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrandeur() throws Exception {
        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();
        grandeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrandeurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grandeur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGrandeurWithPatch() throws Exception {
        // Initialize the database
        grandeurRepository.saveAndFlush(grandeur);

        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();

        // Update the grandeur using partial update
        Grandeur partialUpdatedGrandeur = new Grandeur();
        partialUpdatedGrandeur.setId(grandeur.getId());

        partialUpdatedGrandeur.type(UPDATED_TYPE).valeur(UPDATED_VALEUR).date(UPDATED_DATE);

        restGrandeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrandeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrandeur))
            )
            .andExpect(status().isOk());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
        Grandeur testGrandeur = grandeurList.get(grandeurList.size() - 1);
        assertThat(testGrandeur.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testGrandeur.getValeur()).isEqualTo(UPDATED_VALEUR);
        assertThat(testGrandeur.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateGrandeurWithPatch() throws Exception {
        // Initialize the database
        grandeurRepository.saveAndFlush(grandeur);

        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();

        // Update the grandeur using partial update
        Grandeur partialUpdatedGrandeur = new Grandeur();
        partialUpdatedGrandeur.setId(grandeur.getId());

        partialUpdatedGrandeur.type(UPDATED_TYPE).valeur(UPDATED_VALEUR).date(UPDATED_DATE);

        restGrandeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrandeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrandeur))
            )
            .andExpect(status().isOk());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
        Grandeur testGrandeur = grandeurList.get(grandeurList.size() - 1);
        assertThat(testGrandeur.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testGrandeur.getValeur()).isEqualTo(UPDATED_VALEUR);
        assertThat(testGrandeur.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingGrandeur() throws Exception {
        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();
        grandeur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrandeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grandeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grandeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrandeur() throws Exception {
        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();
        grandeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrandeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grandeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrandeur() throws Exception {
        int databaseSizeBeforeUpdate = grandeurRepository.findAll().size();
        grandeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrandeurMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grandeur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grandeur in the database
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrandeur() throws Exception {
        // Initialize the database
        grandeurRepository.saveAndFlush(grandeur);

        int databaseSizeBeforeDelete = grandeurRepository.findAll().size();

        // Delete the grandeur
        restGrandeurMockMvc
            .perform(delete(ENTITY_API_URL_ID, grandeur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Grandeur> grandeurList = grandeurRepository.findAll();
        assertThat(grandeurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
